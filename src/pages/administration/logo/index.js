import Layout from "../../../components/Layout"
import { Alert, Head, Container, Form, FormGroup, Input } from "reactstrap"
import { Title1 } from "../../../components/StyledComponents"
import { withAuthentication } from "../../../utils/auth"
import { ADMIN } from "../../../utils/roles"

const LogoPage = ({ currentUser }) => {
    return (
      <Layout page="logo" currentUser={currentUser} admin={true}>
        <Head>
          <title>Administration du logo - Medlé</title>
        </Head>
        <Container
          style={{ maxWidth: 980, minWidth: 740 }}
          className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
        >
          <Title1 className="">{"Administration du logo"}</Title1>
        </Container>
        <Container>
          {/* {error && <Alert color="danger mt-4">{error}</Alert>} */}
  
          <Form /*onSubmit={onS}*/>
            <Input type="file" accept="image/*" name="logo" id="logo" /*onChange={handleChange}*//>
          </Form>
        </Container>
      </Layout>
    )
}
export default withAuthentication(LogoPage, ADMIN)