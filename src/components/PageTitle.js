import { Helmet } from 'react-helmet-async'

function PageTitle({ title }) {
  return <Helmet>{title} | Instagram</Helmet>
}

export default PageTitle
