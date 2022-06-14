import { gql, useMutation } from '@apollo/client'
import styled from 'styled-components'
import Comment from './Comment'
import { useForm } from 'react-hook-form'
import useUser from '../../hooks/useUser'

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`

const CommentsContainer = styled.div`
  margin-top: 20px;
`
const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 15px;
`
const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`
const PostCommentInput = styled.input`
  width: 100%;
  font-size: 15px;
  &::placeholder {
    font-size: 15px;
  }
  &:hover {
    background-color: rgba(219, 219, 219, 0.3);
  }
`

function Comments({ author, photoId, caption, commentNumber, comments }) {
  const { data: userData } = useUser()
  const { register, handleSubmit, setValue, getValues } = useForm()
  const createCommentUpdate = (cache, result) => {
    const { payload } = getValues()
    setValue('payload', '')
    const {
      data: {
        createComment: { ok, id },
      },
    } = result
    if (ok && userData?.me) {
      const newComment = {
        __typename: 'Comment',
        createdAt: Date.now() + '',
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      }
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      })
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment]
          },
          commentNumber(prev) {
            return prev + 1
          },
        },
      })
    }
  }
  const [createCommentMutaiton, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    { update: createCommentUpdate }
  )
  const onValid = (data) => {
    const { payload } = data
    if (loading) {
      return
    }
    createCommentMutaiton({
      variables: {
        photoId,
        payload,
      },
    })
  }
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? '1 comment' : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.user.username}
          payload={comment.payload}
          id={comment.id}
          photoId={photoId}
          isMine={comment.isMine}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <PostCommentInput
            {...register('payload', { required: true, minLength: 5 })}
            type="text"
            placeholder="Write a comment.."
          />
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  )
}

export default Comments
