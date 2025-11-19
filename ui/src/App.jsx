import { useState, useMemo } from 'react'
import './App.css'

// 임시 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    image: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    image: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    image: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '우유 거품이 올라간 클래식한 카푸치노',
    image: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '카라멜 마키아토',
    price: 6000,
    description: '달콤한 카라멜과 에스프레소의 만남',
    image: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 6,
    name: '바닐라 라떼',
    price: 5500,
    description: '부드러운 바닐라 향이 일품인 라떼',
    image: null,
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  }
]

function App() {
  const [currentPage, setCurrentPage] = useState('order') // 'order' or 'admin'
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([]) // 주문 목록 (주문하기 화면에서 생성된 주문)
  const [inventory, setInventory] = useState([
    { menuId: 1, menuName: '아메리카노(ICE)', stock: 10 },
    { menuId: 2, menuName: '아메리카노(HOT)', stock: 10 },
    { menuId: 3, menuName: '카페라떼', stock: 10 }
  ])

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
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    try {
      const newOrder = {
        id: Date.now(),
        items: cart.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          options: item.optionNames,
          quantity: item.quantity,
          price: item.totalPrice
        })),
        totalAmount: totalAmount,
        orderDate: new Date(),
        status: 'pending' // pending -> received -> inProgress -> completed
      }

      setOrders([newOrder, ...orders])
      alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`)
      setCart([])
    } catch (error) {
      console.error('주문 처리 중 오류가 발생했습니다:', error)
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 주문 통계 계산 (메모이제이션)
  const orderStatistics = useMemo(() => {
    const total = orders.length
    // pending 상태도 주문 접수로 카운트 (주문이 들어오면 처음에는 주문 접수 상태)
    const received = orders.filter(o => o.status === 'received' || o.status === 'pending').length
    const inProgress = orders.filter(o => o.status === 'inProgress').length
    const completed = orders.filter(o => o.status === 'completed').length
    return { total, received, inProgress, completed }
  }, [orders])

  // 주문 상태 변경
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  // 재고 수정
  const updateInventory = (menuId, change) => {
    setInventory(inventory.map(item => {
      if (item.menuId === menuId) {
        const newStock = Math.max(0, item.stock + change)
        return { ...item, stock: newStock }
      }
      return item
    }))
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
        {currentPage === 'order' ? (
          <>
            <MenuSection menus={menuData} onAddToCart={addToCart} />
            <CartSection 
              cart={cart} 
              total={totalAmount} 
              onRemove={removeFromCart}
              onOrder={handleOrder}
            />
          </>
        ) : (
          <AdminPage
            statistics={orderStatistics}
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
