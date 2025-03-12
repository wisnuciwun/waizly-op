import { useState } from 'react';
import { ModalConfirm, UserAvatar } from '@/components';
import { DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import { Icon } from '@/components';
import { logout } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { persistor } from '@/redux/store';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';
import {setToken} from '@/redux/action/auth';
import {store} from '@/redux/store';

const User = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  
  const handleShowModal = () => {
    setModalConfirmation(prev => !prev);
    setOpen(false);
  };

  const handleClickEditProfile = () => route.push('/edit-profile');

  const handleLogOut = async () => {
    try {
      store.dispatch(setToken(''));
      persistor.pause();
      persistor.flush().then(() => {
        return persistor.purge();
      });

      localStorage.clear();

      setLoading(true);
      const response = await logout();
      if (response.status === 200) {
        route.push('/login');
        setLoading(false);
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
        <DropdownToggle
          tag="a"
          className="dropdown-toggle"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="user-toggle">
            <UserAvatar icon="user-alt" className="sm" />
            {/* <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">Abu Bin Ishityak</div>
          </div> */}
          </div>
        </DropdownToggle>
        <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
          <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
            <div className="user-card sm">
              <div style={{ width: 18, height: 18}} className="user-avatar">
                <UserAvatar icon="user-alt" className="sm" />
              </div>
              <div className="user-info">
                <span className="lead-text text-truncate" style={{ maxWidth: 160, minWidth: 160, fontSize: 12, color: '#4C4F54' }}>{user?.full_name ?? ''}</span>
                <span className="sub-text text-truncate" style={{ maxWidth: 160, minWidth: 160, color: '#203864' }}>{user?.email}</span>
              </div>
            </div>
          </div>
          {!user?.is_sub_account &&
            <div
              onClick={handleClickEditProfile}
              className="dropdown-inner"
              style={{ height: 40, padding: '10px 20px', textAlign: 'start', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Icon name="icon ni ni-user" />
              <span style={{ marginLeft: 10, fontSize: 12 }}>Edit Profil</span>
            </div>
          }
          <div
            onClick={handleShowModal}
            className="dropdown-inner"
            style={{ color: '#FF6E5D', height: 40, padding: '10px 20px', textAlign: 'start', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Icon name="signout" />
            <span style={{ marginLeft: 10, fontSize: 12 }}>Keluar</span>
          </div>
        </DropdownMenu>
      </Dropdown>

      {modalConfirmation && (
        <ModalConfirm
          icon={verificationYesNo}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            width: 420,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            padding: 48,
            marginTop: '-100px',
            paddingTop: 44,
            paddingBottom: 24,
            marginLeft: '-35px',
            marginBottom: 13,
            height: '230px',
          }}
          title={'Apakah Kamu Yakin Ingin Keluar?'}
          subtitle={
            'Jika kamu melanjutkan, kamu perlu masuk kembali untuk mengakses akunmu'
          }
          buttonConfirmation={!loading}
          useTimer={false}
          textSubmit={'Ya, Keluar'}
          handleClickCancelled={handleShowModal}
          handleClickYes={handleLogOut}
          stylesCustomTitle={{
            paddingTop: 0
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
};

export default User;
