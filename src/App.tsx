import { useEffect, useState } from 'react'
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product,
} from './api/productApi'
import './App.css'
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  type User,
} from './api/userApi'

function App() {

  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)


  async function handleSaveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!userName.trim() || !userEmail.trim()) {
      alert('Please enter both name and email.')
      return
    }

    try {
      if (editingUserId !== null) {
        const updatedUser = await updateUser(editingUserId, {
          name: userName.trim(),
          email: userEmail.trim(),
        })

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === editingUserId ? updatedUser : user
          )
        )
      } else {
        const savedUser = await addUser({
          name: userName.trim(),
          email: userEmail.trim(),
        })

        setUsers((currentUsers) => [...currentUsers, savedUser])
      }

      setUserName('')
      setUserEmail('')
      setEditingUserId(null)
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to save user. Please try again.')
    }
  }

  function editUser(id: number) {
    const userToEdit = users.find((user) => user.id === id)

    if (userToEdit) {
      setUserName(userToEdit.name)
      setUserEmail(userToEdit.email)
      setEditingUserId(userToEdit.id)
    }
  }

  async function handleDeleteUser(id: number) {
    try {
      await deleteUser(id)

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id)
      )

      if (editingUserId === id) {
        setUserName('')
        setUserEmail('')
        setEditingUserId(null)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. Please try again.')
    }
  }


  const totalProducts = products.length

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => {
        console.error('Error loading users:', error)
      })
  }, [])

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.error('Error loading products:', error)
      })
  }, [])

  const totalStock = products.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  )

  const totalInventoryValue = products.reduce(
    (totalPrice, curr) => totalPrice + curr.price * curr.quantity,
    0
  )


  async function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || price === '' || quantity === '') {
      alert('Please fill in all fields.')
      return
    }

    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)

    if (
      !Number.isFinite(numericPrice) ||
      !Number.isFinite(numericQuantity) ||
      numericPrice < 0 ||
      numericQuantity < 0 ||
      !Number.isInteger(numericQuantity)
    ) {
      alert('Enter a valid price and a non-negative whole-number quantity.')
      return
    }

    if (editingProductId !== null) {
      try {
        const updatedProduct = await updateProduct(editingProductId, {
          name: name.trim(),
          price: numericPrice,
          quantity: numericQuantity,
        })

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProductId ? updatedProduct : product
          )
        )

        setName('')
        setPrice('')
        setQuantity('')
        setEditingProductId(null)
      } catch (error) {
        console.error('Error updating product:', error)
        alert('Failed to update product. Please try again.')
      }

      return
    }

    try {
      const savedProduct = await addProduct({
        name: name.trim(),
        price: numericPrice,
        quantity: numericQuantity,
      })

      setProducts((currentProducts) => [...currentProducts, savedProduct])

      setName('')
      setPrice('')
      setQuantity('')
      setEditingProductId(null)
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    }
  }



  async function handleDeleteProduct(id: number) {
    try {
      await deleteProduct(id)

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      )

      if (editingProductId === id) {
        setName('')
        setPrice('')
        setQuantity('')
        setEditingProductId(null)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }


  function editProduct(id: number) {
    const productToEdit = products.find((product) => product.id === id)

    if (productToEdit) {
      setName(productToEdit.name)
      setPrice(String(productToEdit.price))
      setQuantity(String(productToEdit.quantity))
      setEditingProductId(productToEdit.id)
    }
  }

  return (
    <div>
      <h1>Inventory Management System</h1>
      <p>Welcome to our inventory application.</p>

      <section>
        <h2>{editingProductId !== null ? 'Edit Product' : 'Add New Product'}</h2>

        <form onSubmit={handleAddProduct}>
          <div>
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label htmlFor="productPrice">Price ($)</label>
            <input
              id="productPrice"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label htmlFor="productQuantity">Quantity</label>
            <input
              id="productQuantity"
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <button type="submit">
            {editingProductId !== null ? 'Update Product' : 'Add Product'}
          </button>

          {editingProductId !== null && (
            <button
              type="button"
              onClick={() => {
                setName('')
                setPrice('')
                setQuantity('')
                setEditingProductId(null)
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <h2>Products</h2>
        <p>Manage your inventory products here.</p>

        <p>Total Products: {totalProducts}</p>
        <p>Total Stock: {totalStock}</p>
        <p>
          Total Inventory Value: $
          {totalInventoryValue.toLocaleString('en-US')}
        </p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const isLowStock = product.quantity <= 5

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>{isLowStock ? 'Low Stock' : 'In Stock'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => editProduct(product.id)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h2>{editingUserId !== null ? 'Edit User' : 'Add New User'}</h2>

        <form onSubmit={handleSaveUser}>
          <div>
            <label htmlFor="userName">Name</label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Enter user name"
              required
            />
          </div>

          <div>
            <label htmlFor="userEmail">Email</label>
            <input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(event) => setUserEmail(event.target.value)}
              placeholder="Enter user email"
              required
            />
          </div>

          <button type="submit">
            {editingUserId !== null ? 'Update User' : 'Add User'}
          </button>

          {editingUserId !== null && (
            <button
              type="button"
              onClick={() => {
                setUserName('')
                setUserEmail('')
                setEditingUserId(null)
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <h2>Users</h2>
        <p>Manage users through the User Service.</p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => editUser(user.id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  )
}

export default App