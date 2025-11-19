import { useState } from 'react'
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
  const [cart, setCart] = useState([])

  // 장바구니에 아이템 추가
  const addToCart = (menu, selectedOptions) => {
    const optionPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0)
    const totalPrice = menu.price + optionPrice
    const optionNames = selectedOptions.map(opt => opt.name)

    // 동일한 메뉴+옵션 조합 찾기
    const existingItemIndex = cart.findIndex(item => 
      item.menuId === menu.id && 
      JSON.stringify(item.selectedOptions.map(o => o.optionId).sort()) === 
      JSON.stringify(selectedOptions.map(o => o.id).sort())
    )

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
  }

  // 장바구니에서 아이템 제거
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
  }

  // 총 금액 계산
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  // 주문하기
  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }

    const orderData = {
      items: cart.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        options: item.optionNames,
        quantity: item.quantity,
        price: item.totalPrice
      })),
      totalAmount: calculateTotal(),
      orderDate: new Date()
    }

    console.log('주문 데이터:', orderData)
    alert(`주문이 완료되었습니다!\n총 금액: ${calculateTotal().toLocaleString()}원`)
    setCart([])
  }

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <MenuSection menus={menuData} onAddToCart={addToCart} />
        <CartSection 
          cart={cart} 
          total={calculateTotal()} 
          onRemove={removeFromCart}
          onOrder={handleOrder}
        />
      </div>
    </div>
  )
}

// 헤더 컴포넌트
function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">COZY</div>
        <nav className="nav-buttons">
          <button className="nav-button active">주문하기</button>
          <button className="nav-button">관리자</button>
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
              <div key={index} className="cart-item">
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

export default App
