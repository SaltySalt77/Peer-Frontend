'use client'

import React, { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import useAuthStore from '@/states/useAuthStore'
import { useCookies } from 'react-cookie'
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import CuTextField from '@/components/CuTextField'
import CuTextFieldLabel from '@/components/CuTextFieldLabel'
import OauthLoginBox from './panel/OauthLoginBox'
import useMedia from '@/hook/useMedia'

interface ILoginFormInput {
  userEmail: string
  password: string
}

const PCBase = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '80px',
}

const MobileBase = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '20px',
}

const PCLoginBox = {
  display: 'flex',
  position: 'relative',
  width: '496px',
  padding: '24px 24px 40px 24px',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '48px',
  borderRadius: '16px',
  border: '1px solid #000',
}

const MobileLoginBox = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 32px 15px 32px',
}

const Form = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
}

const PCLabelBox = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  fontSize: '14px',
}

const Login = () => {
  const { isPc } = useMedia()
  const API_URL = process.env.API_URL
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuthStore()
  const [, setCookie] = useCookies(['refreshToken'])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginFormInput>()

  const onSubmit: SubmitHandler<ILoginFormInput> = (data) => {
    console.log(data)
    setIsLoading(true)
    axios
      .post(`${API_URL}/login/`, {
        userEmail: data.userEmail,
        password: data.password,
      })
      .then((res) => {
        console.log(res)
        login(res.data.userId, res.data.accessToken)
        setCookie('refreshToken', res.data.refreshToken, { path: '/' })
      })
      .catch((error) => {
        console.log(error.message)
      })
    setIsLoading(false)
  }

  return (
    <>
      <Container sx={isPc ? PCBase : MobileBase}>
        <Container sx={isPc ? PCLoginBox : MobileLoginBox}>
          <Typography margin={3}>Peer</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={Form}>
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Controller
                name="userEmail"
                control={control}
                defaultValue=""
                rules={{
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: '이메일 형식이 아닙니다',
                  },
                }}
                render={({ field }) => (
                  <Box sx={PCLabelBox}>
                    <CuTextFieldLabel
                      htmlFor="userEmail"
                      style={{ color: '#000', font: 'inherit' }}
                    >
                      이메일
                    </CuTextFieldLabel>
                    <CuTextField
                      field={field}
                      id="userEmail"
                      style={{ width: '100%' }}
                      placeholder="이메일을 입력하세요."
                    />
                  </Box>
                )}
              />
              {errors.userEmail && (
                <Typography>{errors.userEmail.message}</Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', width: '100%' }}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: '비밀번호를 입력해주세요',
                }}
                render={({ field }) => (
                  <Box sx={PCLabelBox}>
                    <CuTextFieldLabel
                      htmlFor="password"
                      style={{ color: '#000', font: 'inherit' }}
                    >
                      비밀번호
                    </CuTextFieldLabel>
                    <CuTextField
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      field={field}
                      style={{ width: '100%' }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="비밀번호를 입력하세요."
                    />
                  </Box>
                )}
              />
              {errors.password && (
                <Typography>{errors.password.message}</Typography>
              )}
            </Box>
            <Button type="submit" disabled={isLoading}>
              로그인
            </Button>
          </Box>
          <Box sx={Form}>
            {isPc ? (
              <Typography sx={{ color: '#868686' }}>간편 로그인</Typography>
            ) : (
              <Typography
                sx={{ color: '#868686', fontSize: '10px', marginTop: '24px' }}
              >
                또는
              </Typography>
            )}
            <OauthLoginBox />
          </Box>
          <Container
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              ...(isPc ? {} : { marginTop: '104px' }),
            }}
          >
            <Button href="/signup">회원가입</Button>
            <Button href="/find-account">비밀번호 찾기</Button>
          </Container>
        </Container>
      </Container>
    </>
  )
}

export default Login
