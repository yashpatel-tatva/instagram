import { Stack } from '@mui/material';
import '../../App.css'
import instaTextLogo from '../../assets/img/png/instaTextLogo.png'
import { assets } from '../../constants/Assets'
import StoryScrollContainer from '../../components/storyscrollContainer/StoryScrollContainer';
import PostContainer from '../../components/postcontainer/PostContainer';

export const Home = () => {
    return (
        <div>
            <div className='formobile'>
                <div className='w-screen justify-between flex border-b-2 ' style={{ padding: '2% 4%' }}>
                    <div className='flex' style={{ width: 'fit-content' }}><img src={instaTextLogo} alt='Instagram' width={'120px'}></img></div>
                    <Stack justifyContent={'space-between'} spacing={2} direction={'row'}>
                        <div role='button' className='flex gap-2 items-center' style={{ width: 'fit-content' }}><img src={assets.addIcon} width={'28px'} alt='' /> <span className='md:hidden'>Add</span></div>
                        <div role='button' className='flex gap-2 items-center' style={{ width: 'fit-content' }}><img src={assets.notificationIcon} width={'28px'} alt='' /> <span className='md:hidden'>Notification</span></div>
                    </Stack>
                </div>
            </div>
            <div>
                <div><StoryScrollContainer /></div>
                <div className='formobile border-b-2'></div>
            </div>
            <div className='flex'>
                <div className='flex justify-center flex-grow'>
                    <Stack justifyContent={'center'} alignItems='center'>
                        <PostContainer />
                        <PostContainer />
                    </Stack>
                </div>
                <div className='w-3/12 sm:hidden'>
                    Hi
                </div>
            </div>
        </div>
    );
};