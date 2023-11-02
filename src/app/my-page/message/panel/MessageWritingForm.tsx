'use client'

import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Avatar,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { IMessageInformation } from '@/types/IMessageInformation'
import useMessageStore from '@/states/useMessageStore'

interface IProps {
  userInfo?: ILetterTarget
  type: string
  nickname: string | undefined
  keyword?: string
  setMessageData?: (prevData: any) => void | IMessageInformation[] | undefined
  handleClose?: any | undefined
}

interface IMessageData {
  targetId: number
  content: string
}

export interface ILetterTarget {
  targetId: number
  targetEmail: string
  targetNickname: string
  targetProfile: string
}

interface ITargetItemProps {
  letterTarget: ILetterTarget
  setTargetUser: (targetUser: ILetterTarget) => void
}

function TargetItem({ letterTarget, setTargetUser }: ITargetItemProps) {
  // const selectMessageTarget = (targetId: number) => {
  //   console.log('targetId', targetId)
  //   useMessageStore.setState({
  //     storedSelectedUser: targetId,
  //   })
  // }
  const { targetEmail, targetNickname, targetProfile } = letterTarget

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={1}
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        setTargetUser(letterTarget)
      }}
    >
      <Avatar src={targetProfile} />
      <Typography>{`${targetNickname} (${targetEmail})`}</Typography>
    </Stack>
  )
}

interface ITargetListProps {
  letterTargetList: ILetterTarget[]
  setTargetUser: (targetUser: ILetterTarget) => void
}

const TargetList = ({ letterTargetList, setTargetUser }: ITargetListProps) => {
  return (
    <Stack>
      {letterTargetList.map((target: ILetterTarget) => (
        <TargetItem
          key={target.targetId}
          letterTarget={target}
          setTargetUser={setTargetUser}
        />
      ))}
    </Stack>
  )
}

const MessageForm = ({
  userInfo,
  type,
  keyword,
  setMessageData,
  // nickname,
  handleClose,
}: IProps) => {
  const router = useRouter()
  const [content, setContent] = useState('')
  const updateMessageData = (newMessage: IMessageInformation) => {
    setMessageData?.((prevData: any) => [...prevData, newMessage])
  }
  const messageSubmitHandler = useCallback(async () => {
    try {
      if (!content) {
        alert('내용을 입력하세요.')
        return
      } else if (!userInfo) {
        alert('받는 사람을 입력하세요.')
        return
      }
      // const response = await axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/new-message`,
      //   {
      //     body: {
      //       targetId: storedSelectedUser,
      //       content,
      //     },
      //   },
      // )
      // setContent('')
      // updateMessageData(response.data)
      // handleClose()
    } catch (error) {
      alert('쪽지 전송에 실패하였습니다. 다시 시도해주세요.')
    }
  }, [keyword, content, router, type, updateMessageData])

  return (
    <>
      <Typography>{`받는 사람 : ${
        userInfo ? userInfo.targetNickname : ''
      }`}</Typography>
      <TextField
        sx={{ width: '100%' }}
        value={content}
        placeholder="내용을 입력하세요"
        variant="outlined"
        multiline
        rows={3}
        onChange={(e) => setContent(e.target.value)}
      />
      <Stack direction={'row'} justifyContent={'space-around'} spacing={3}>
        <Button variant="contained" onClick={() => handleClose()}>
          취소
        </Button>
        <Button variant="contained" onClick={messageSubmitHandler}>
          보내기
        </Button>
      </Stack>
    </>
  )
}

// TODO : 반드시 삭제

const dummySearchResult = [
  {
    targetId: 0,
    targetEmail: 'heyheyhey',
    targetNickname: 'hey',
    targetProfile: 'https://picsum.photos/200',
  },
  {
    targetId: 1,
    targetEmail: 'hihihi',
    targetNickname: 'hi',
    targetProfile: 'https://picsum.photos/200',
  },
  {
    targetId: 2,
    targetEmail: 'hellohello',
    targetNickname: 'hello',
    targetProfile: 'https://picsum.photos/200',
  },
]

const MessageWritingForm = ({ handleClose }: any) => {
  const [keyword, setKeyword] = useState('')
  const [targetUser, setTargetUser] = useState<ILetterTarget | undefined>()
  const [letterTargetList, setLetterTargetList] = useState<
    ILetterTarget[] | undefined
  >(dummySearchResult)

  //TODO: 반환된 검색 결과 state 에 실어서 보내기 (받는 사람 정보)

  const searchUserWithKeyword = useCallback(async () => {
    if (!keyword) {
      alert('검색어를 입력하세요.')
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/searching`,
        {
          keyword: keyword,
        },
        {
          headers: { 'Cache-Control': 'no-store' },
        },
      )
      setLetterTargetList(response.data)
    } catch (error) {
      alert('존재하지 않는 사람입니다.')
    }
  }, [keyword])

  return (
    <Stack alignItems={'center'} spacing={2}>
      <Typography>새 쪽지</Typography>
      <Stack direction={'row'} alignItems={'stretch'} sx={{ width: '100%' }}>
        <TextField
          sx={{ width: '100%' }}
          value={keyword}
          placeholder="닉네임 혹은 이메일을 입력하세요"
          variant="outlined"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={searchUserWithKeyword}>검색</Button>
      </Stack>
      {letterTargetList && (
        <TargetList
          letterTargetList={letterTargetList}
          setTargetUser={setTargetUser}
        />
      )}
      <MessageForm
        userInfo={targetUser}
        type={'newMessage'}
        keyword={keyword}
        handleClose={handleClose}
        nickname=""
      />
    </Stack>
  )
}

export default MessageWritingForm
