import { AddCircle, Delete } from "@material-ui/icons"
import { PropTypes } from "prop-types"
import React, { useState } from "react"
import { Button, Container, Input, Table } from "reactstrap"

import { createMessage, deleteMessage, findAllMessages } from "../../../clients/messages"
import Layout from "../../../components/Layout"
import { Title1 } from "../../../components/StyledComponents"
import { buildAuthHeaders, redirectIfUnauthorized, withAuthentication } from "../../../utils/auth"
import { preventDefault } from "../../../utils/form"
import { ADMIN } from "../../../utils/roles"
import { logError } from "../../../utils/logger"

const MessageRow = ({ message, onDelete }) => (
  <tr>
    <td>{message.content}</td>
    <td>{message.start_date}</td>
    <td>{message.end_date}</td>
    <td>
      <Button onClick={() => onDelete(message.id)}>
        <Delete />
      </Button>
    </td>
  </tr>
)

MessageRow.propTypes = {
  message: PropTypes.object,
  onDelete: PropTypes.fun,
}

const MessagePage = ({ currentUser, messages = [] }) => {
  const [content, setContent] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentMessages, setCurrentMessages] = useState(messages)

  const refreshUsers = async () => {
    try {
      setCurrentMessages(await findAllMessages())
    } catch (err) {
      logError(err)
    }
  }
  const onDelete = async (id) => {
    await deleteMessage(id)
    await refreshUsers()
  }
  const onCreate = preventDefault(async () => {
    await createMessage({
      content,
      start_date: startDate,
      end_date: endDate,
    })
    await refreshUsers()
  })
  return (
    <Layout page="messages" currentUser={currentUser} admin={true}>
      <Container
        style={{ maxWidth: 980, minWidth: 740 }}
        className="mt-5 mb-5 d-flex justify-content-between align-items-baseline"
      >
        <Title1 className="">{"Administration des messages"}</Title1>
      </Container>
      <Container>
        <form onSubmit={onCreate}>
          <Table>
            <thead>
              <tr>
                <th style={{ maxWidth: "50%" }}>Message</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((message) => (
                <MessageRow key={message.id} message={message} onDelete={onDelete} />
              ))}

              <tr>
                <td>
                  <Input
                    type="textarea"
                    name="content"
                    placeholder="Message"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="date"
                    name="start_date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="date"
                    name="end_date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </td>
                <td>
                  <Button type="submit">
                    <AddCircle />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </form>
      </Container>
    </Layout>
  )
}

MessagePage.propTypes = {
  paginatedData: PropTypes.object,
  currentUser: PropTypes.object.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object),
}

MessagePage.getInitialProps = async (ctx) => {
  const headers = buildAuthHeaders(ctx)

  try {
    const messages = await findAllMessages(headers)
    return {
      messages,
    }
  } catch (error) {
    logError("APP error", error)
    redirectIfUnauthorized(error, ctx)
  }

  return {}
}
export default withAuthentication(MessagePage, ADMIN)
