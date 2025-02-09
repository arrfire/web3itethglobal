import { Footer } from '@/common/components/organisms';
import { IdeaType } from '@/common/types';
import { Hero } from './Hero';
import { TrendingProjects } from './trendingProjects';
import { DevelopmentProcess } from './developmentProcess';
import { Stats } from './stats';
import { getIdeas } from '../actions';

const Home = async () => {
  const ideas = await getIdeas()
  const tokens = ideas as Array<IdeaType> | []
  return (
    <div className="min-h-screen overflow-hidden">
      <Hero />
      <TrendingProjects ideaTokens={tokens} />
      <DevelopmentProcess />
      <Stats ideaTokens={tokens} />
      <Footer />
    </div>
  );
}

export default Home
