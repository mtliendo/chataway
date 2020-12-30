import React from 'react'
import styles from '../styles/Home.module.css'
import { API } from 'aws-amplify'
import { listMessages } from '../graphql/queries'
import { createMessage } from '../graphql/mutations'
import { onCreateMessage } from '../graphql/subscriptions'

export default function Home() {
  const [messageContent, setMessageContent] = React.useState('')
  const [messages, setMessages] = React.useState([])

  React.useEffect(() => {
    API.graphql({ query: listMessages }).then((messageData) =>
      setMessages(messageData.data.listMessages.items)
    )
  }, [])

  React.useEffect(() => {
    const subscription = API.graphql({ query: onCreateMessage }).subscribe({
      next: ({ provider, value }) => {
        const messageDetails = value.data.onCreateMessage
        console.log(messages)
        setMessages([...messages, messageDetails])
      },
    })

    return () => subscription.unsubscribe()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    API.graphql({
      query: createMessage,
      variables: { input: { text: messageContent } },
    }).then((res) => setMessages([...messages, res.data.createMessage]))
  }

  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <p>
          {message.owner}: {message.text}
        </p>
      ))}
      <form onSubmit={handleSubmit}>
        <label>
          Enter a message
          <input
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
        </label>
        <button>enter</button>
      </form>
    </div>
  )
}
