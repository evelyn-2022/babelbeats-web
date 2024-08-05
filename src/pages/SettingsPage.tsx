import { ThemeSwitcher } from '../components';

const SettingsPage: React.FC = () => {
  return (
    <div className='flex flex-col gap-14 px-6 py-1.5 lg:py-2.5'>
      <section>
        <h2 className='font-bold text-xl'>Settings</h2>
        <div className='border-b border-white/20 my-4'></div>
        <div className='flex flex-row items-center justify-between'>
          <div>
            <div className='font-semibold'>Appearance</div>
            <div className='text-customBlack/50 dark:text-white/60'>
              Customize the look of the app
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
