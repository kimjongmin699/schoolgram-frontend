import { gql, useMutation } from '@apollo/client'
import styled from 'styled-components'

import { faHeart as SolidHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faComment,
  faPaperPlane,
  faBookmark,
} from '@fortawesome/free-regular-svg-icons'

import Comments from './Comments'
import { FatText } from '../shared'
import Avatar from '../Avatar'
import { FEED_QUERY } from '../../screens/Home'
import { Link } from 'react-router-dom'

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 20px;
  max-width: 615px;
`

const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`
const Username = styled(FatText)`
  margin-left: 5px;
  font-size: 20px;
`
const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`
const PhotoData = styled.div`
  padding: 15px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`
const PhotoActions = styled.div`
  display: flex;
  align-items: cneter;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
`
const PhotoAction = styled.div`
  margin-right: 15px;
  cursor: pointer;
`
const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`
const Photo = ({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentNumber,
  comments,
  photoId,
}) => {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result
    if (ok) {
      const photoId = `Photo:${id}`
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1
            }
            return prev + 1
          },
        },
      })
      // const fragmentId = `Photo:${id}`
      // const fragment = gql`
      //   fragment BSName on Photo {
      //     isLiked
      //     likes
      //   }
      // `
      // const result = cache.readFragment({
      //   id: fragmentId,
      //   fragment,
      // })
      // if ('isLiked' in result && 'likes' in result) {
      //   const { isLiked: cacheIsLiked, likes: cacheLikes } = result
      //   cache.writeFragment({
      //     id: fragmentId,
      //     fragment,
      //     data: {
      //       isLiked: !cacheIsLiked,
      //       likes: cacheIsLiked ? cacheLikes - 1 : cacheLikes + 1,
      //     },
      //   })
      // }
    }
  }

  const [toggleLike, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
    // refetchQueries: [{ query: FEED_QUERY }],
  })
  return (
    <div>
      <PhotoContainer key={id}>
        <PhotoHeader>
          <Link to={`/users/${user.username}`}>
            <Avatar lg url={user.avatar} />
          </Link>
          <Link to={`/users/${user.username}`}>
            <Username>{user.username}</Username>
          </Link>
        </PhotoHeader>
        <PhotoFile src={file} />
        <PhotoData>
          <PhotoActions>
            <div>
              <PhotoAction onClick={toggleLike}>
                <FontAwesomeIcon
                  style={{ color: isLiked ? 'tomato' : 'inherit' }}
                  size={'2x'}
                  icon={isLiked ? SolidHeart : faHeart}
                />
              </PhotoAction>
              <PhotoAction>
                <FontAwesomeIcon size={'2x'} icon={faComment} />
              </PhotoAction>
              <PhotoAction>
                <FontAwesomeIcon size={'2x'} icon={faPaperPlane} />
              </PhotoAction>
            </div>
            <div style={{ marginRight: '15px' }}>
              <FontAwesomeIcon size={'2x'} icon={faBookmark} />
            </div>
          </PhotoActions>
          <Likes>{likes === 1 ? '1 likes' : `${likes} likes`}</Likes>

          <Comments
            author={user.username}
            caption={caption}
            commentNumber={commentNumber}
            comments={comments}
            photoId={photoId}
          />
        </PhotoData>
      </PhotoContainer>
    </div>
  )
}
export default Photo
