import { useCart } from './context/CartContext';

interface CartProps {
    onContinueShopping: () => void;
}

function Cart({ onContinueShopping }: CartProps) {
    const { cart, removeFromCart, clearCart } = useCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="container my-4">

            {/* Header row */}
            <div className="row align-items-center mb-4">
                <div className="col">
                    <h1 className="mb-0">Your Cart</h1>
                </div>
                <div className="col-auto">
                    <button className="btn btn-outline-secondary" onClick={onContinueShopping}>
                        ← Continue Shopping
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.bookId}>
                                            <td>{item.title}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeFromCart(item.bookId)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="row justify-content-end">
                                <div className="col-auto">
                                    <p className="fs-5"><strong>Total: ${total.toFixed(2)}</strong></p>
                                    <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Cart;
