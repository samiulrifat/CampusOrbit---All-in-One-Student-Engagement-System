import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AchievementList from '../components/Achievements/AchievementList';
import UserAchievements from '../components/Achievements/UserAchievements';
import AwardAchievement from '../components/Achievements/AwardAchievement';
import CreateAchievement from '../components/Achievements/CreateAchievement';  // Import it
import "./AchievementsPage.css";

const AchievementsPage = () => {
  const { clubId } = useParams();
  const [refresh, setRefresh] = useState(0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Club Achievements</h1>
      
      {/* Achievement creation form for officers/admins */}
      <CreateAchievement clubId={clubId} onCreate={() => setRefresh(r => r + 1)} />

      {/* Achievement awarding */}
      <AwardAchievement clubId={clubId} onAward={() => setRefresh(r => r + 1)} />

      {/* User's earned achievements */}
      <UserAchievements clubId={clubId} key={refresh} />

      {/* List of all club achievements */}
      <AchievementList clubId={clubId} />
    </div>
  );
};

export default AchievementsPage;
