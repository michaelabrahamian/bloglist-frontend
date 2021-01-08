import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const addLike = async blogObject => {
  const reqData = {
    ...blogObject,
    likes: blogObject.likes + 1
  }

  console.log('blogObject', blogObject)

  const config = {
    headers: { Authorization: token },
  }

  const reqUrl = `${baseUrl}/${blogObject.id}`
  console.log('reqUrl', reqUrl)

  const response = await axios.put(reqUrl, reqData, config)
  console.log('success', response.data)

  return response.data
}

// Delete the blog
const remove = async blogId => {
  const config = {
    headers: { Authorization: token },
  }

  const reqUrl = `${baseUrl}/${blogId}`

  const response = await axios.delete(reqUrl, config)
  return response.data
}

export default { getAll, setToken, create, addLike, remove }