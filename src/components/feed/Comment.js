import styled from 'styled-components'
import { FatText } from '../shared'
// import sanitizeHtml from 'sanitize-html'
import React from 'react'
import { Link } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`

const CommentContainer = styled.div`
  margin-bottom: 7px;
`
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`

function Comment({ author, payload, id, photoId, isMine }) {
  // const cleanedPayload = sanitizeHtml(
  //   payload.replace(/#[\w]+/g, '<mark>$&</mark>'),
  //   {
  //     allowedTags: ['mark'],
  //   }
  // )
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result
    if (ok) {
      cache.evict({ id: `Comment:${id}` })
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1
          },
        },
      })
    }
  }
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  })
  const onDeleteClick = () => {
    deleteCommentMutation()
  }
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>

      {/* <CommentCaption
        dangerouslySetInnerHTML={{
          __html: cleanedPayload,
        }}
      /> */}
      <CommentCaption>
        {payload.split(' ').map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{' '}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
      {isMine ? <button onClick={onDeleteClick}>X</button> : null}
    </CommentContainer>
  )
}

export default Comment
