
export type Product = {
  id: number
  name: string
  price: number
  quantity: number
}

const API_URL = "http://localhost:8081/api/products"
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}


export async function addProduct(
  product: Omit<Product, 'id'>
): Promise<Product> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Failed to add product')
  }

  return response.json()
}


export async function updateProduct(
  id: number,
  product: Omit<Product, 'id'>
): Promise<Product> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Failed to update product')
  }

  return response.json()
}


export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete product')
  }
}