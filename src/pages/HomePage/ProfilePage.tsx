import { useAuth } from '../../context';

const ProfilePage: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className='flex flex-col px-6'>
      <div>
        <h2 className='font-bold'>My profile</h2>
        <div className='border-b-[1px] border-customWhite/5 my-4'></div>
        <div className='w-16 aspect-square'>
          {authState.user?.profilePic ? (
            <>
              <img
                src={authState.user.profilePic}
                alt='profile picture'
                className='rounded-full'
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                  if (target.nextSibling) {
                    (target.nextSibling as HTMLElement).style.display = 'flex';
                  }
                }}
                style={{
                  display: authState.user.profilePic ? 'block' : 'none',
                }}
              />
              <div
                className='flex items-center justify-center aspect-square bg-gray-500 text-white rounded-full text-xl font-bold'
                style={{ display: 'none' }}
              >
                {authState.user.name.charAt(0)}
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center aspect-square bg-gray-500 text-white rounded-full text-xl font-bold'>
              {authState.user?.name.charAt(0)}
            </div>
          )}
        </div>
        <div>{authState.user?.name.split(' ')[0]}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
