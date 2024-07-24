import { Navbar } from '../../components';

const HomePage: React.FC = () => {
  return (
    <div className='flex flex-col px-6'>
      <Navbar />
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
