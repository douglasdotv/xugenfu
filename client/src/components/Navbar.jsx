import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Xugenfu</Link> | <Link to="/login">Log in</Link> {' | '}
      <Link to="/signup">Sign up</Link>
    </nav>
  )
}

export default Navbar
