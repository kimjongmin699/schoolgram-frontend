import useUser from '../hooks/useUser'
import { gql, useQuery } from '@apollo/client'

import PageTitle from '../components/PageTitle'
import Photo from '../components/feed/Photo'

export const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
      id
      user {
        id
        username
        avatar
      }
      file
      caption
      likes
      commentNumber
      createdAt
      isMine
      isLiked
      comments {
        id
        user {
          username
          avatar
        }
        payload
        isMine
        createdAt
      }
    }
  }
`
const Home = () => {
  const User = useUser()
  console.log(User)
  const { data } = useQuery(FEED_QUERY, {
    variables: {
      offset: 2,
    },
  })
  console.log(data)
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) => (
        <Photo
          key={photo.id}
          id={photo.id}
          user={photo.user}
          file={photo.file}
          isLiked={photo.isLiked}
          likes={photo.likes}
          caption={photo.caption}
          commentNumber={photo.commentNumber}
          comments={photo.comments}
          photoId={photo.id}
        />
      ))}
    </div>
  )
}

export default Home
