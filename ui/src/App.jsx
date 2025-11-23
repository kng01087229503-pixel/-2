import { useState, useMemo, useEffect } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:3002'

function App() {
  const [currentPage, setCurrentPage] = useState('order') // 'order' or 'admin'
  const [menus, setMenus] = useState([])
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([]) // 서버에서 조회한 주문 목록
  const [inventory, setInventory] = useState([]) // 서버에서 조회한 재고
  const [statistics, setStatistics] = useState({ total: 0, received: 0, inProgress: 0, completed: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 초기 메뉴 로딩
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setError(null)
        const res = await fetch(`${API_BASE_URL}/api/menus`)
        if (!res.ok) throw new Error('메뉴를 불러오지 못했습니다.')
        const data = await res.json()
        setMenus(data)
      } catch (err) {
        console.error(err)
        setError('메뉴 로딩 중 오류가 발생했습니다.')
      }
    }
    fetchMenus()
  }, [])

  // 관리자 페이지용 데이터 로딩
  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [inventoryRes, ordersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/inventory`),
        fetch(`${API_BASE_URL}/api/orders`),
        fetch(`${API_BASE_URL}/api/orders/statistics`)
      ])

      if (!inventoryRes.ok || !ordersRes.ok || !statsRes.ok) {
        throw new Error('관리자 데이터를 불러오지 못했습니다.')
      }

      const [inventoryData, ordersData, statsData] = await Promise.all([
        inventoryRes.json(),
        ordersRes.json(),
        statsRes.json()
      ])

      setInventory(inventoryData)
      setOrders(ordersData)
      setStatistics(statsData)
    } catch (err) {
      console.error(err)
      setError('관리자 데이터 로딩 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 페이지 전환 시 관리자 데이터 로딩
  useEffect(() => {
    if (currentPage === 'admin') {
      loadAdminData()
    }
  }, [currentPage])

  // 장바구니에 아이템 추가
  const addToCart = (menu, selectedOptions) => {
    try {
      const optionPrice = selectedOptions.reduce((sum, opt) => sum + (opt.price || 0), 0)
      const totalPrice = menu.price + optionPrice
      const optionNames = selectedOptions.map(opt => opt.name)

      // 동일한 메뉴+옵션 조합 찾기 (JSON.stringify 대신 배열 비교 사용)
      const selectedOptionIds = selectedOptions.map(o => o.id).sort()
      const existingItemIndex = cart.findIndex(item => {
        if (item.menuId !== menu.id) return false
        const itemOptionIds = item.selectedOptions.map(o => o.optionId).sort()
        if (itemOptionIds.length !== selectedOptionIds.length) return false
        return itemOptionIds.every((id, idx) => id === selectedOptionIds[idx])
      })

      if (existingItemIndex >= 0) {
        // 기존 아이템 수량 증가
        const updatedCart = [...cart]
        updatedCart[existingItemIndex].quantity += 1
        updatedCart[existingItemIndex].totalPrice = 
          (updatedCart[existingItemIndex].basePrice + optionPrice) * updatedCart[existingItemIndex].quantity
        setCart(updatedCart)
      } else {
        // 새 아이템 추가
        const newItem = {
          menuId: menu.id,
          menuName: menu.name,
          basePrice: menu.price,
          selectedOptions: selectedOptions.map(opt => ({
            optionId: opt.id,
            optionName: opt.name,
            optionPrice: opt.price
          })),
          optionNames: optionNames,
          quantity: 1,
          totalPrice: totalPrice
        }
        setCart([...cart, newItem])
      }
    } catch (error) {
      console.error('장바구니 추가 중 오류가 발생했습니다:', error)
      alert('장바구니에 추가하는 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 장바구니에서 아이템 제거
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
  }

  // 총 금액 계산 (메모이제이션)
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }, [cart])

  // 주문하기
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    try {
      const orderPayload = {
        items: cart.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          options: item.optionNames,
          quantity: item.quantity,
          price: item.totalPrice
        })),
        totalAmount: totalAmount,
        orderDate: new Date()
      }

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })

      if (!res.ok) {
        throw new Error('주문 생성에 실패했습니다.')
      }

      const createdOrder = await res.json()

      setOrders([createdOrder, ...orders])
      alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
      setCart([])
    } catch (error) {
      console.error('주문 처리 중 오류가 발생했습니다:', error)
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 주문 상태 변경
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('주문 상태 변경에 실패했습니다.')

      // 상태 변경 후 관리자 데이터 다시 로딩
      await loadAdminData()
    } catch (error) {
      console.error('주문 상태 변경 중 오류가 발생했습니다:', error)
      alert('주문 상태 변경 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 재고 수정
  const updateInventory = async (menuId, change) => {
    try {
      const target = inventory.find(item => item.menuId === menuId)
      if (!target) return
      const newStock = Math.max(0, target.stock + change)

      const res = await fetch(`${API_BASE_URL}/api/inventory/${menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      })

      if (!res.ok) throw new Error('재고 수정에 실패했습니다.')

      const updated = await res.json()
      setInventory(inventory.map(item => 
        item.menuId === updated.menuId ? updated : item
      ))
    } catch (error) {
      console.error('재고 수정 중 오류가 발생했습니다:', error)
      alert('재고 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 재고 상태 확인
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', color: '#ef4444' }
    if (stock < 5) return { text: '주의', color: '#f59e0b' }
    return { text: '정상', color: '#10b981' }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="main-content">
        {error && <div className="error-message">{error}</div>}
        {currentPage === 'order' ? (
          <>
            <MenuSection menus={menus} onAddToCart={addToCart} />
            <CartSection 
              cart={cart} 
              total={totalAmount} 
              onRemove={removeFromCart}
              onOrder={handleOrder}
            />
          </>
        ) : (
          <AdminPage
            statistics={statistics}
            inventory={inventory}
            orders={orders}
            onUpdateInventory={updateInventory}
            onUpdateOrderStatus={updateOrderStatus}
            getStockStatus={getStockStatus}
          />
        )}
      </div>
    </div>
  )
}

// 헤더 컴포넌트
function Header({ currentPage, onPageChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">COZY</div>
        <nav className="nav-buttons">
          <button 
            className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => onPageChange('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onPageChange('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  )
}

// 메뉴 섹션 컴포넌트
function MenuSection({ menus, onAddToCart }) {
  return (
    <section className="menu-section">
      <div className="menu-grid">
        {menus.map(menu => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}

// 메뉴 카드 컴포넌트
function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleOptionChange = (option, checked) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, option])
    } else {
      setSelectedOptions(selectedOptions.filter(opt => opt.id !== option.id))
    }
  }

  const calculatePrice = () => {
    const optionPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    return menu.price + optionPrice
  }

  const handleAddToCart = () => {
    onAddToCart(menu, selectedOptions)
    setSelectedOptions([]) // 옵션 초기화
  }

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} />
        ) : (
          <div className="image-placeholder"></div>
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{calculatePrice().toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
        <div className="menu-options">
          {menu.options.map(option => (
            <label key={option.id} className="option-label">
              <input
                type="checkbox"
                checked={selectedOptions.some(opt => opt.id === option.id)}
                onChange={(e) => handleOptionChange(option, e.target.checked)}
              />
              <span>
                {option.name} {option.price > 0 && `(+${option.price.toLocaleString()}원)`}
              </span>
            </label>
          ))}
        </div>
        <button className="add-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

// 장바구니 섹션 컴포넌트
function CartSection({ cart, total, onRemove, onOrder }) {
  return (
    <section className="cart-section">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">장바구니가 비어있습니다.</p>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.menuId}-${item.selectedOptions.map(o => o.optionId).join('-')}-${index}`} className="cart-item">
                <div className="cart-item-left">
                  <span className="cart-item-text">
                    {item.menuName}
                    {item.optionNames.length > 0 && ` (${item.optionNames.join(', ')})`} X {item.quantity}
                  </span>
                </div>
                <div className="cart-item-right">
                  <span className="cart-item-price">{item.totalPrice.toLocaleString()}원</span>
                  <button 
                    className="remove-button" 
                    onClick={() => onRemove(index)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <div className="total-amount">
            총 금액 <strong>{total.toLocaleString()}원</strong>
          </div>
          <button 
            className="order-button" 
            onClick={onOrder}
            disabled={cart.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  )
}

// 관리자 페이지 컴포넌트
function AdminPage({ statistics, inventory, orders, onUpdateInventory, onUpdateOrderStatus, getStockStatus }) {
  // 주문 상태에 따른 버튼 텍스트 및 다음 상태
  const getOrderButtonInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: '주문 접수', nextStatus: 'received' }
      case 'received':
        return { text: '제조 시작', nextStatus: 'inProgress' }
      case 'inProgress':
        return { text: '제조 완료', nextStatus: 'completed' }
      case 'completed':
        return { text: '완료됨', nextStatus: null }
      default:
        return { text: '주문 접수', nextStatus: 'received' }
    }
  }

  // 날짜 포맷팅
  const formatDate = (date) => {
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) {
        return '날짜 정보 없음'
      }
      const month = d.getMonth() + 1
      const day = d.getDate()
      const hours = d.getHours()
      const minutes = d.getMinutes().toString().padStart(2, '0')
      return `${month}월 ${day}일 ${hours}:${minutes}`
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error)
      return '날짜 정보 없음'
    }
  }

  return (
    <>
      {/* 관리자 대시보드 */}
      <section className="admin-dashboard">
        <h2 className="section-title">관리자 대시보드</h2>
        <div className="statistics">
          <span>총 주문 {statistics.total}</span>
          <span>/</span>
          <span>주문 접수 {statistics.received}</span>
          <span>/</span>
          <span>제조 중 {statistics.inProgress}</span>
          <span>/</span>
          <span>제조 완료 {statistics.completed}</span>
        </div>
      </section>

      {/* 재고 현황 */}
      <section className="inventory-section">
        <h2 className="section-title">재고 현황</h2>
        <div className="inventory-grid">
          {inventory.map(item => {
            const status = getStockStatus(item.stock)
            return (
              <div key={item.menuId} className="inventory-card">
                <h3 className="inventory-menu-name">{item.menuName}</h3>
                <div className="inventory-info">
                  <span className="inventory-stock">{item.stock}개</span>
                  <span className="inventory-status" style={{ color: status.color }}>
                    {status.text}
                  </span>
                </div>
                <div className="inventory-controls">
                  <button 
                    className="inventory-btn minus"
                    onClick={() => onUpdateInventory(item.menuId, -1)}
                    disabled={item.stock === 0}
                  >
                    -
                  </button>
                  <button 
                    className="inventory-btn plus"
                    onClick={() => onUpdateInventory(item.menuId, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 주문 현황 */}
      <section className="order-status-section">
        <h2 className="section-title">주문 현황</h2>
        <div className="order-list">
          {orders.length === 0 ? (
            <p className="empty-orders">주문이 없습니다.</p>
          ) : (
            orders.map(order => {
              const buttonInfo = getOrderButtonInfo(order.status)
              return (
                <div key={order.id} className="order-card">
                  <div className="order-date">{formatDate(order.orderDate)}</div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        {item.menuName}
                        {item.options.length > 0 && ` (${item.options.join(', ')})`} x {item.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="order-amount">{order.totalAmount.toLocaleString()}원</div>
                  {buttonInfo.nextStatus && (
                    <button
                      className="order-action-button"
                      onClick={() => onUpdateOrderStatus(order.id, buttonInfo.nextStatus)}
                    >
                      {buttonInfo.text}
                    </button>
                  )}
                  {!buttonInfo.nextStatus && (
                    <div className="order-completed">완료됨</div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </>
  )
}

export default App
