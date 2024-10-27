const Signup = () => {
  return (
    <div>
      <h2>Signup</h2>
      <form>
        <label>
          Username: <input type="text" name="username" />
        </label>
        <label>
          Name: <input type="text" name="name" />
        </label>
        <label>
          Password: <input type="password" name="password" />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default Signup
