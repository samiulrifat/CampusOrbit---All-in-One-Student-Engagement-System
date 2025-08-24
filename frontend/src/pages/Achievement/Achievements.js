import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AchievementList from '../../components/Achievements/AchievementList';
import UserAchievements from '../../components/Achievements/UserAchievements';
import AwardAchievement from '../../components/Achievements/AwardAchievement';
import CreateAchievement from '../../components/Achievements/CreateAchievement';
import useAuth from "../../hooks/useAuth";
import "./Achievements.css";

const AchievementsPage = () => {
  const { user } = useAuth();
  const { clubId } = useParams();
  const [refresh, setRefresh] = useState(0);

  if (!user) return null;

  const isAdmin = user.role === 'club_admin';

  return (
    <div className="achievements-page">
      <div className="achievements-card">
        <h1>🏆 Achievements</h1>

        {isAdmin ? (
          <>
            <div className="achievements-section">
              <CreateAchievement clubId={clubId} onCreate={() => setRefresh(r => r + 1)} />
            </div>
            <div className="achievements-section">
              <AwardAchievement clubId={clubId} onAward={() => setRefresh(r => r + 1)} />
            </div>
          </>
        ) : (
          <>
            <div className="achievements-section">
              <UserAchievements clubId={clubId} refresh={refresh} />
            </div>
            <div className="achievements-section">
              <AchievementList clubId={clubId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
