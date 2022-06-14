import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Button from '../components/auth/Button'
import { FatText } from '../components/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons'
import useUser from '../hooks/useUser'

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      username
      bio
      avatar
      photos {
        id
        file
        likes
        commentNumber
        isLiked
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
`
const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`
const UNFOLLOWER_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`
const Header = styled.div`
  display: flex;
  margin-top: 40px;
`
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`

const Column = styled.div``
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`
const List = styled.ul`
  display: flex;
`
const Item = styled.li`
  margin-right: 20px;
`
const Value = styled(FatText)`
  font-size: 18px;
`
const Name = styled(FatText)`
  font-size: 18px;
`

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 50px 30px;
`

const Photo = styled.div`
  background-size: cover;
  position: relative;
  background-image: url(${(props) => props.bg});
`
const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0.2;
  &:hover {
    opacity: 0.8;
  }
`
const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`
const ProfileBtn = styled(Button).attrs({
  as: 'span',
})`
  margin-left: 20px;
  margin-right: 0px;
  cursor: pointer;
`

function Profile() {
  const { username } = useParams()
  const { data: userData } = useUser()
  const client = useApolloClient()
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  })
  const followUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result
    if (!ok) {
      return
    }
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return false
        },
        totalFollowers(prev) {
          return prev - 1
        },
      },
    })
    const { me } = userData
    cache.modify({
      id: `User:${me.username}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1
        },
      },
    })
  }

  const [unfollowUserMutation] = useMutation(UNFOLLOWER_USER_MUTATION, {
    variables: {
      username,
    },
    update: followUserUpdate,
    //refetchQueries: [
    //{query: SEE_PROFILE_QUERY, variables:{username}}
    //  ,{query:SEE_PROFILE_QUERY, variables:{username:userData?.me?.username}}]
  })
  const followUserCompleted = (data) => {
    const {
      followUser: { ok },
    } = data
    if (!ok) {
      return
    }
    const { cache } = client
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return true
        },
        totalFollowers(prev) {
          return prev + 1
        },
      },
    })
    const { me } = userData
    cache.modify({
      id: `User:${me.username}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1
        },
      },
    })
  }
  const [followUserMutation] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    onCompleted: followUserCompleted,
    //refetchQueries: [{query: SEE_PROFILE_QUERY, variables:{username}}]
  })

  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>
    }
    if (isFollowing) {
      return <ProfileBtn onClick={unfollowUserMutation}>Unfollow</ProfileBtn>
    } else {
      return <ProfileBtn onClick={followUserMutation}>Follow</ProfileBtn>
    }
  }
  return (
    <div>
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers} followers</Value>
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing} following</Value>
                </span>
              </Item>
            </List>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>

      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo key={photo.id} bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  )
}

export default Profile
