import { Link } from 'react-router-dom'
import './pages.css'

export default function NotFound() {
  return (
    <div className="page page-enter">
      <div className="wrap empty notfound">
        <h1 className="display page-title">Esta página evaporou.</h1>
        <p className="lead">O endereço não existe ou o perfume não faz parte do catálogo.</p>
        <Link to="/perfumes" className="btn btn-solid">
          Ver perfumes
        </Link>
      </div>
    </div>
  )
}
