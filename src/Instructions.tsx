import React from 'react';
import styled from 'styled-components';
import { Sliders } from './bits/Tabs';
import { useParams } from 'react-router-dom';
import Button from './bits/Button';
import { useNavigate } from "react-router-dom";

import box from '../src/res/box.png';
import charger from '../src/res/charger.png';
import pixmob from '../src/res/pixmob.png';
import pixmobWithCharger from '../src/res/pixmob_with_charger.png';
import boxBack from '../src/res/box_back.png';
import frame from '../src/res/frame.png';
import { FrameStatus } from './brains/useTayframeMqtt';
import useUser from './brains/useUser';

const Buttons = styled.div`
  flex: 0 0 auto;
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Container = styled.div`
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: space-between;
  gap: 16px;
  padding: 16px;
  font-family: "Roboto", sans-serif;
  text-align: justify;

  & h1 {
    text-align: center;
    font-family: 'TayFrame';
  }

  & > div {
    overflow-y: auto;
  }

  & > div > div > div {
    display: flex;
    flex-direction: column;
  }

  & img {
    height: 200px;
    width: auto;
    margin: auto;
  }
`;

const Contents = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: space-evenly;
  padding: 16px;

  & hr {
    width: 100%;
  }
`;

const StyledContent = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  gap: 16px;

  & img {
    height: auto;
    margin: 0;
  }
`;

const Welcome = () => {
  const { user } = useUser();
  const userName = user?.userName;

  return (
    <div>
      <h2 style={{textTransform: 'capitalize'}}>Congratulations, {userName},</h2>
      on getting your first <b style={{ display: 'contents', fontSize: 'large' }}>TayFrame!</b>

      <h1>ARE YOU READY<br />FOR IT?</h1>
    </div>
  );
};

const Content = ({ image, text }: any) => (
  <StyledContent>
    <img src={image} alt="" />
    {text}
  </StyledContent>
);

const Parts = () => (
  <div>
    <h1>Frame Content</h1>
    <Contents>
      <Content image={frame} text="1x Frame" />
      <hr />
      <Content image={box} text="1x FrameBrain (Purple)" />
      <hr />
      <Content image={charger} text="4x Chargers" />
    </Contents>
  </div>
);

const Chargers = () => (
  <div>
    <h1>Chargers</h1>
    <p>Your wristbands work with small batteries.</p>
    <p>The batteries run out of charge after a few hours, but your TayFrame comes with 4 chargers!</p>
    <p>These are not real chargers, but you can use them instead of the
      batteries so that you never have to replace them.</p>
    <img src={charger} alt="Charger" width="100%" />
  </div>
);

const OpenPixMob = () => (
  <div>
    <h1>Chargers</h1>
    <p>I've inserted most of them, but left one out so you can see how it's done.</p>
    <p>You'll need to open your wristband to remove the batteries.</p>
    <p>A knife / pen / screwdriver will help. There's 6 tabs over 3 sides,
      slighly pull them outwards to open the wristband, starting with the front ones. Don't pull too much,
      but don't worry they're quite hard to break.
    </p>
    <p>This is what the wristband should look like on the inside once you remove the batteries.</p>
    <img src={pixmob} alt="Pixmob" width="100%" />
  </div>
);

const PlaceCharger = () => (
  <div>
    <h1>Chargers</h1>
    <p>Simply place the charger inside. It should fit comfortably.
      Pay attention to the polarity (+/- signs). The charger should match the symbol on the wristband.</p>
    <p>When you close it, there will be a small gap near the front-right tab. Try to place the cable there.</p>
    <img src={pixmobWithCharger} alt="Pixmob" width="100%" />
  </div>
);

const Assembly = () => (
  <div>
    <h1>Assembly</h1>
    <p>Put together the inside of your TayFrame.</p>
    <p>You can print your tickets, add your friendship bracelets,
      use stickers, and most importantly up to 4 wristbands from the concert!</p>
    <p>There's 2 little lights inside the frame, at the top-right and bottom-left corners.
      Pay attention not to covert at least one of them — but preferably neither!</p>
    <p>The Frame has a white sheet and a black back side.</p>
    <p>You'll need to cut holes to pass the chargers through the white sheet. They're about 2mm x 5mm.
      You can then hide the cables in between the white and black sheet.
    </p>
    <p>Have a look at <a
      target="_blank" rel="noreferrer" href="https://www.pinterest.co.uk/baldini0713/tayframe/">this Pinterest board
      </a> for inspiration if needed!</p>
  </div>
);

const FrameBrain = () => (
  <div>
    <h1>FrameBrain</h1>
    <p>Last assembly step!</p>
    <p>Once the frame is closed up, plug all the wires into the FrameBrain.
      You don't need to plug all of the chargers — just the ones you used!</p>
    <p>The connectors for the wires are color-coded. They should match the color on the box.</p>
    <img src={boxBack} alt="Pixmob" width="100%" />
  </div>
);

const PlugAndPlay = () => (
  <div>
    <h1>Plug And Play!</h1>
    <p>Turn on your WiFi and power the FrameBrain with a normal usb-c cable.</p>
    <p>It should auto connect to your WiFi, but if not, here is how.</p>
    <p>Whenever you power your TayFrame, if it can't connect to any WiFi it'll start its own.
      This cannot connect it to the internet, but it's just for you to set it up.</p>
    <p>It'll start a hotspot called — you guessed it — TayFrame. Connect to it with your phone and
      it should open a page where you can enter your WiFi password. Make sure to select the correct one!</p>
    <p>Once you do that, the TayFrame will connect to the internet and the button will turn green!</p>
    <p>The hotspot will automatically turn off after 3min. Unplug and plug it back to turn it back on.</p>
  </div>
);

const routes = [
  { path: 'welcome', component: <Welcome /> },
  { path: 'parts', component: <Parts /> },
  { path: 'chargers', component: <Chargers /> },
  { path: 'open-pixmob', component: <OpenPixMob /> },
  { path: 'place-charger', component: <PlaceCharger /> },
  { path: 'assembly', component: <Assembly /> },
  { path: 'frame-brain', component: <FrameBrain /> },
  { path: 'plug-and-play', component: <PlugAndPlay /> },
];

const stageToIdx = (path: string) => routes.findIndex(route => route.path === path);

type InstructionsProps = {
  frameStatus: FrameStatus;
};

const Instructions = ({ frameStatus }: InstructionsProps) => {
  const navigate = useNavigate();
  const { stage } = useParams();

  console.log(stage);
  let stageIdx = stageToIdx(stage || '');
  stageIdx = stageIdx !== -1 ? stageIdx : 0;

  const back = () => navigate(-1);
  const next = () => navigate('../' + routes[stageIdx + 1].path, { relative: "path" });
  const start = () => navigate('app');

  const isConnected = frameStatus === 'CONNECTED';

  return (
    <Container>
      <Sliders focusedIdx={stageIdx}>
        {routes.map(({ component }) => component)}
      </Sliders>
      <Buttons>
        <Button $color="transparent" onClick={back} disabled={stageIdx === 0}>Back</Button>
        {stageIdx !== routes.length - 1
          ? <Button $color="green" onClick={next}>Next</Button>
          : <Button $color={isConnected ? 'green' : 'red'} onClick={start} disabled={!isConnected}>Start</Button>}
      </Buttons>
    </Container>
  );
};

export default Instructions;
