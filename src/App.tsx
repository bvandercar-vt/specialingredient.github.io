import 'font-awesome/css/font-awesome.min.css'
import './styles/index.css'

import { GridBody } from './components/GridBody'
import { Header } from './components/Header'

export const App = () => {
  return (
    <>
      {Header}
      {<GridBody />}
    </>
  )
}
