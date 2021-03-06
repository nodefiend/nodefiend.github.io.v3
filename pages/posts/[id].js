import { useRouter} from 'next/router'
import { Container, useColorMode, Box, Heading, Wrap, WrapItem, Center, Icon } from "@chakra-ui/react"
import { useEffect, useState, useContext } from 'react'
import { Context } from '../../contexts'
import axios from 'axios'
import Image from 'next/image';
import Head from 'next/head'
import Link from 'next/link'
import {PostsList} from './index'

async function fetchDevArticle (dispatch,id) {
  const response = await axios.get(`https://dev.to/api/articles/${id}`)

  dispatch({type: "GET_ARTICLE", payload: response.data})
}

const Post = () => {
  const { state, dispatch } = useContext(Context);

  const {currentArticle} = state;
  const router = useRouter()
  const { id } = router.query

  const { colorMode } = useColorMode()
  const accentColor = colorMode == "light" ? '#96bb7c' : '#ff6363'

  useEffect(()=>{
    if (id) {
      fetchDevArticle(dispatch,id)
    }
  }, [dispatch, id])

    return (
      <>
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        currentArticle &&
        <Article currentArticle={currentArticle}/>
      }
      </>
    )
}

function Article ({currentArticle: {
  id,
  cover_image,
  canonical_url,
  description,
  title,
  published_at,
  positive_reactions_count,
  comments_count,
  tag_list
}}) {
  const { colorMode } = useColorMode()
  const accentColor = colorMode == "light" ? '#96bb7c' : '#ff6363'

  return (
    <>


        <Head>
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <div
        style={{
          border: `4px solid ${accentColor}`,
          borderRadius: '10px',
          fontSize: "36px",
          marginBottom: "30px"
        }}
      >
        <Image width="100vw" height="auto" src={cover_image} alt={cover_image} />
        <Link href="/posts" as="/posts">
          <a>Back to Posts</a>
        </Link>
        <h1>{id.toString()}</h1>

        <Box w={["250px"]} maxW="sm" overflow="hidden">

          <Box mb="2em">
            <Box
              color={accentColor}
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {title}
            </Box>
            <Box
             mt="1"
             fontWeight="semibold"
             as="h4"
             lineHeight="tight"
             isTruncated
           >
             {description}
           </Box>
          </Box>
        </Box>
      </div>
    </>
  )
}

export default Post