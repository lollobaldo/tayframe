import styled from 'styled-components';

import appStoreImage from '../res/app-store-light.svg';

const StyledButton = styled.img`
`;

const AppStoreButton = ({ link, ...props }: any) => (
  <StyledButton src={appStoreImage} onClick={() => window.open(link, '_blank')} />
);

export default AppStoreButton;
