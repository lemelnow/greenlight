import React from 'react';
import Card from 'react-bootstrap/Card';
import {
  Col, Row, Tab, Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import AdminNavSideBar from '../AdminNavSideBar';
import RoomConfigRow from './RoomConfigRow';
import useRoomConfigs from '../../../hooks/queries/rooms/useRoomConfigs';
import { useAuth } from '../../../contexts/auth/AuthProvider';
import RoomConfigPlaceHolder from './RoomConfigPlaceHolder';

export default function RoomConfig() {
  const { t } = useTranslation();
  const { data: roomConfigs, isLoading } = useRoomConfigs();
  const currentUser = useAuth();

  if (currentUser.permissions?.ManageSiteSettings !== 'true') {
    return <Navigate to="/404" />;
  }

  return (
    <div id="admin-panel" className="pb-3">
      <h3 className="py-5"> { t('admin.admin_panel') } </h3>
      <Card className="border-0 card-shadow">
        <Tab.Container activeKey="room_configuration">
          <Row>
            <Col className="pe-0" sm={3}>
              <div id="admin-sidebar">
                <AdminNavSideBar />
              </div>
            </Col>
            <Col className="ps-0" sm={9}>
              <Tab.Content className="p-0">
                <Container className="p-0">
                  <div className="p-4 border-bottom">
                    <h3> { t('admin.room_configuration.room_configuration') } </h3>
                  </div>

                  {
            isLoading
              ? (
                // eslint-disable-next-line react/no-array-index-key
                [...Array(8)].map((val, idx) => <RoomConfigPlaceHolder key={idx} />)
              )
              : (
                <div className="p-4">
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.allow_room_to_be_recorded')}
                    subtitle={t('admin.room_configuration.configurations.allow_room_to_be_recorded_description')}
                    settingName="record"
                    value={roomConfigs?.record}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.require_user_signed_in')}
                    subtitle={t('admin.room_configuration.configurations.require_user_signed_in_description')}
                    settingName="glRequireAuthentication"
                    value={roomConfigs?.glRequireAuthentication}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.require_mod_approval')}
                    subtitle={t('admin.room_configuration.configurations.require_mod_approval_description')}
                    settingName="guestPolicy"
                    value={roomConfigs?.guestPolicy}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.allow_any_user_to_start_meeting')}
                    subtitle={t('admin.room_configuration.configurations.allow_any_user_to_start_meeting_description')}
                    settingName="glAnyoneCanStart"
                    value={roomConfigs?.glAnyoneCanStart}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.allow_users_to_join_as_mods')}
                    subtitle={t('admin.room_configuration.configurations.allow_users_to_join_as_mods_description')}
                    settingName="glAnyoneJoinAsModerator"
                    value={roomConfigs?.glAnyoneJoinAsModerator}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.mute_users_on_join')}
                    subtitle={t('admin.room_configuration.configurations.mute_users_on_join_description')}
                    settingName="muteOnStart"
                    value={roomConfigs?.muteOnStart}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.viewer_access_code')}
                    subtitle={t('admin.room_configuration.configurations.viewer_access_code_description')}
                    settingName="glViewerAccessCode"
                    value={roomConfigs?.glViewerAccessCode}
                  />
                  <RoomConfigRow
                    title={t('admin.room_configuration.configurations.mod_access_code')}
                    subtitle={t('admin.room_configuration.configurations.mod_access_code_description')}
                    settingName="glModeratorAccessCode"
                    value={roomConfigs?.glModeratorAccessCode}
                  />
                </div>
              )
          }
                </Container>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Card>
    </div>
  );
}
