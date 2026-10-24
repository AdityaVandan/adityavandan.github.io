import { nav } from '../data/content.js'

export function Paper() {
  return <div className="paper-grain" aria-hidden="true" />
}

export function Masthead({ onHome }) {
  const hrefFor = (id) => (onHome ? `#${id}` : `/#${id}`)

  return (
    <nav className="masthead" aria-label="Primary">
      <a className="masthead-mark press-link" href={onHome ? '#top' : '/#top'}>
        A.V.S.
      </a>
      <ul>
        {nav.map((item) => (
          <li key={item.id}>
            <a className="press-link" href={hrefFor(item.id)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Colophon() {
  return (
    <footer className="colophon">
      <p>Set in Playfair Display & Libre Franklin · Printed on screen stock</p>
    </footer>
  )
}
