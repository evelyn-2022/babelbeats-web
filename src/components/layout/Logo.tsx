import wave from '../../assets/images/wave.svg';

const Logo: React.FC = () => {
  return (
    <div className='flex flex-row items-center gap-1.5'>
      <div className='rounded-full bg-primary p-0.5'>
        <img src={wave} className='w-4 h-4 md:w-5 md:h-5' alt='Wave' />
      </div>
      <div className='font-sans font-bold md:text-lg'>BabelBeats</div>
    </div>
  );
};

export default Logo;
