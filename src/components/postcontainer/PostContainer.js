import React from 'react'
import { assets } from '../../constants/Assets'
import { IconButton, Stack } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EllipsisTextUptoTwo from '../ellipsisTextTwoline/EllipsisTextUptoTwo';

const PostContainer = () => {
    return (
        <div className='w-6/12 md:w-9/12 fm:w-full border-b-2 fnm:border-0'>
            <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                    <div role='button' className='flex gap-2 items-center' style={{ width: 'fit-content' }}><img src={assets.personIcon} width={'28px'} alt='' /> </div>
                    <div>PJ_EXPLAINED</div>
                </div>
                <div>
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                </div>
            </div>
            <div className=''>
                <div >
                    <img className='rounded' style={{ width: '100%' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt3q9O1lr3vhTXJD7Oq7y0EJATknCP3U8f-A&s' alt='gorila'></img>
                </div>
            </div>
            <div className='flex justify-between py-2'>
                <Stack spacing={2} direction={'row'} sx={{ width: 'fit-content' }}>
                    <IconButton><img src={assets.notificationIcon} alt='like' width={'30px'}></img></IconButton>
                    <IconButton><img src={assets.commentIcon} alt='like' width={'30px'}></img></IconButton>
                    <IconButton><img src={assets.shareIcon} alt='like' width={'30px'}></img></IconButton>
                </Stack>
                <IconButton><img src={assets.bookmarkIcon} alt='like' width={'30px'}></img></IconButton>
            </div>
            <div>
                <span>8,333 likes</span>
            </div>
            <div>
                <span>PJ_EXPLAINED</span>
                <EllipsisTextUptoTwo
                    text={"Lorem ipsum dolor sit, amet consectetur . Molestiae odio rem numquam labore ipsam laborum accusamus ex, ad cum aliquam ducimus maiores similique pariatur. Consequuntur voluptatibus aliquam laboriosam totam eum."}>
                </EllipsisTextUptoTwo>
            </div>
            <div className='my-2'>
                <span>View all 30 comments</span>
            </div>
            <div className='my-2'>
                <span>Add a comment</span>
            </div>
        </div>
    )
}

export default PostContainer
