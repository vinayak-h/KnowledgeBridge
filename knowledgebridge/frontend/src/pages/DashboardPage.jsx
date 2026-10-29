import HeroSection from '../components/dashboard/HeroSection.jsx';
import StatGrid from '../components/dashboard/StatGrid.jsx';
import HandoverListPanel from '../components/dashboard/HandoverListPanel.jsx';
import BottomNote from '../components/dashboard/BottomNote.jsx';

export default function DashboardPage({ list, onCreate, onOpen, onDelete }) {
  return (
    <>
      <HeroSection onCreate={onCreate} />
      <StatGrid stats={list.globalStats} />
      <HandoverListPanel
        list={list}
        onCreate={onCreate}
        onOpen={onOpen}
        onDelete={onDelete}
      />
      <BottomNote onCreate={onCreate} />
    </>
  );
}
