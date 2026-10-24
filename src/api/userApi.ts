export type User = {
  id: number
  name: string
  email: string
}

const API_URL = 'http://localhost:8081/api/users'

export async function getUsers(): Promise<User[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error('Failed to create user')
  }

  return response.json()
}

export async function updateUser(
  id: number,
  user: Omit<User, 'id'>
): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}

