/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Grid, TextField, Modal, Typography, Card, Container } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import socket from '../socket';
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { ChatWindow } from '../sections/@dashboard/chat';
import { PATH_DASHBOARD } from '../routes/paths';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '15px',
  p: 4,
};

// const styleVideoGroup = {
//   flexGrow: '1',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   padding: '1rem',
// };

const styleVideo = {
  borderRadius: '1rem',
  margin: '0.5rem',
  width: '100%',
  objectFit: 'cover',
};

// ----------------------------------------------------------------------

export default function ChatPage() {
  const { auth } = useSelector((state) => state);

  const [id, setId] = useState('');
  const conversationRef = useRef([]);
  const [localStream, setLocalStream] = useState(null);
  const remoteStreamRef = useRef(null);
  const [render, setRender] = useState(0);
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localVideoScreenRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteVideoScreenRef = useRef(null);
  const offerRef = useRef(null);
  const fromRef = useRef(null);
  const connectionToRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [disableShare, setDisableShare] = useState(false);
  const [disableCall, setDisableCall] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    socket.emit('init', { id: auth.user._id });

    socket.on('init', ({ id }) => {
      console.log('onInit', { id });
    });
    socket.on('request', async ({ from, offer }) => {
      console.log('onRequest', { from, offer });
      if (from === connectionToRef.current) {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer', {
          userId: from,
          answer: peerConnection.current.localDescription,
        });
      } else if (!connectionToRef.current) {
        setOpen(true);
        offerRef.current = offer;
        fromRef.current = from;
      } else {
        socket.emit('bussy', {
          from: auth.user._id,
          to: from,
        });
      }
      console.log(peerConnection);
    });

    socket.on('answer', async ({ from, answer }) => {
      console.log('onAnswer', { from, answer });
      connectionToRef.current = from;
      const remoteDesc = new RTCSessionDescription(answer);
      await peerConnection.current.setRemoteDescription(remoteDesc);
      console.log(peerConnection);
    });

    socket.on('bussy', ({ from }) => {
      console.log('onBussy', { from });
      alert(`User ${from} already on a connect`);
    });

    socket.on('stopShareVideo', () => {
      console.log('onStopShareVideo');
      remoteVideoScreenRef.current.srcObject = null;
    });

    socket.on('candidate', async (data) => {
      console.log('onCandidate', { data });
      if (data) {
        await peerConnection.current.addIceCandidate(data);
      }
    });

    socket.on('closeConnection', () => {
      console.log('onCloseConnection');
      peerConnection.current.close();
      peerConnection.current = null;
      remoteStreamRef.current = null;
      remoteVideoRef.current.srcObject = null;
      offerRef.current = null;
      fromRef.current = null;
      connectionToRef.current = null;
      conversationRef.current = [];
      setDisableCall(false);
      reset();
    });

    return () => {
      socket.disconnect();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const reset = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    dataChannelRef.current = peerConnection.current.createDataChannel('dataChannel');

    // Get access to the user's camera and microphone
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => console.log(error));

    peerConnection.current.ontrack = (event) => {
      console.log('pcTrack', remoteStreamRef.current, event.streams[0]);
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = event.streams[0];
        remoteVideoRef.current.srcObject = event.streams[0];
      } else if (event.streams[0].id !== remoteStreamRef.current.id) {
        remoteVideoScreenRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.addEventListener('icecandidate', async (event) => {
      console.log('pcIceCandidate');
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate, userId: connectionToRef.current });
      }
    });

    peerConnection.current.addEventListener('datachannel', (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onopen = (e) => console.log('open!!!!');
      receiveChannel.onmessage = (e) => {
        console.log('message!!!!', JSON.parse(e.data));
        conversationRef.current = [...conversationRef.current, JSON.parse(e.data)];
        setRender(uuidv4());
      };
      receiveChannel.onclose = (e) => console.log('closed!!!!!!');
    });

    peerConnection.current.addEventListener('connectionstatechange', (event) => {
      console.log('pcConnectionStateChange', event.target.connectionState);
      setDisableCall(false);
      if (event.target.connectionState === 'connected') {
        setDisableCall(true);
        socket.emit('connected', { connectionTo: connectionToRef.current });
      }
      if (event.target.connectionState === 'disconnected') {
        socket.emit('end', {});
        peerConnection.current.close();
        peerConnection.current = null;
        remoteStreamRef.current = null;
        remoteVideoRef.current.srcObject = null;
        offerRef.current = null;
        fromRef.current = null;
        connectionToRef.current = null;
        conversationRef.current = [];
        setDisableCall(false);
        reset();
      }
      setRender(uuidv4());
    });

    peerConnection.current.onnegotiationneeded = async () => {
      console.log('pcNegotiationNeeded');
      if (connectionToRef.current) {
        await peerConnection.current.setLocalDescription(await peerConnection.current.createOffer());
        socket.emit('request', {
          userId: connectionToRef.current,
          offer: peerConnection.current.localDescription,
        });
      }
    };
  };
  useEffect(() => {
    reset();
  }, []);

  const startCall = (e) => {
    e.preventDefault();
    if (id !== auth?.user?._id) {
      // Create an offer to send to the remote peer
      peerConnection.current
        .createOffer()
        .then((offer) => peerConnection.current.setLocalDescription(offer))
        .then(() => {
          const offer = peerConnection.current.localDescription;
          socket.emit('request', {
            userId: id,
            offer,
          });
        })
        .catch((error) => console.log(error));
    }
    console.log(peerConnection);
  };

  const answerCall = () => {
    // Set the remote description from the offer
    peerConnection.current
      .setRemoteDescription(new RTCSessionDescription(offerRef.current))
      .then(() => peerConnection.current.createAnswer())
      .then((answer) => peerConnection.current.setLocalDescription(answer))
      .then(() => {
        // Send the answer to the remote peer
        connectionToRef.current = fromRef.current;
        const answer = peerConnection.current.localDescription;
        socket.emit('answer', {
          userId: fromRef.current,
          answer,
        });
      })
      .catch((error) => console.log(error));
    console.log(peerConnection);
    setOpen(false);
  };

  const onShareScreen = () => {
    const options = { audio: 'browser', video: 'browser' };

    navigator.mediaDevices.getDisplayMedia(options).then(
      (stream) => {
        localVideoScreenRef.current.srcObject = stream;
        setDisableShare(true);
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        stream.getVideoTracks()[0].addEventListener('ended', (e) => {
          stream.getTracks().forEach((track) => {
            const sender = peerConnection.current.getSenders().find((s) => s.track === track);
            if (sender) {
              peerConnection.current.removeTrack(sender);
            }
          });

          setDisableShare(false);
          localVideoScreenRef.current.srcObject = null;

          socket.emit('stopShareVideo', {
            userId: connectionToRef.current,
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleSendMessage = (value) => {
    console.log('handleSendMessage', value);
    if (dataChannelRef.current) {
      const { readyState } = dataChannelRef.current;
      if (readyState === 'open') {
        conversationRef.current = [...conversationRef.current, value];
        console.log(conversationRef.current);
        dataChannelRef.current.send(JSON.stringify(value));
        setRender(uuidv4());
      }
    }
  };
  return (
    <Page title="Chat">
      <Container maxWidth={true ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: '10px' }}>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styleModal}>
                  <Typography id="modal-modal-title" variant="h4" component="h2">
                    You received a request for a video call
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button variant="contained" onClick={answerCall} sx={{ padding: '5px', margin: '5px' }}>
                      Accept
                    </Button>
                    <Button variant="outlined" onClick={handleClose} sx={{ padding: '5px', margin: '5px' }}>
                      Close
                    </Button>
                  </Box>
                </Box>
              </Modal>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: '5px' }}>
                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', pr: '5px' }}>
                  <b>Your id: </b>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => navigator.clipboard.writeText(`${auth?.user?._id}`)}
                >
                  <p>{auth?.user?._id}</p>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                <TextField
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  sx={{ marginRight: '10px', flex: 1 }}
                  placeholder="Enter your friend's id to request connect"
                  onSubmit={startCall}
                  disabled={disableCall}
                />
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ padding: '10px', width: '150px', margin: '5px' }}
                  startIcon={<PhoneCallbackIcon />}
                  onClick={startCall}
                  disabled={disableCall}
                >
                  Start Call
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', my: '5px' }}>
                <Button
                  variant="contained"
                  sx={{ padding: '10px', width: '150px', margin: '5px' }}
                  onClick={onShareScreen}
                  disabled={disableShare}
                  endIcon={<ScreenShareIcon />}
                >
                  Share Screen
                </Button>
                <Button
                  variant="outlined"
                  sx={{ padding: '10px', width: '150px', margin: '5px' }}
                  onClick={() => {
                    if (localStream) {
                      localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
                      setRender(uuidv4());
                    }
                  }}
                  endIcon={localStream?.getVideoTracks()[0]?.enabled ? <VideocamIcon /> : <VideocamOffIcon />}
                >
                  Share Video
                </Button>
                <Button
                  variant="outlined"
                  sx={{ padding: '10px', width: '150px', margin: '5px' }}
                  onClick={() => {
                    if (localStream) {
                      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
                      setRender(uuidv4());
                    }
                  }}
                  endIcon={localStream?.getAudioTracks()[0]?.enabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                >
                  Share Audio
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    socket.emit('end', {});
                    peerConnection.current.close();
                    peerConnection.current = null;
                    remoteStreamRef.current = null;
                    remoteVideoRef.current.srcObject = null;
                    offerRef.current = null;
                    fromRef.current = null;
                    connectionToRef.current = null;
                    conversationRef.current = [];
                    setDisableCall(false);
                    reset();
                  }}
                  sx={{ padding: '10px', width: '150px', margin: '5px' }}
                  endIcon={<PhoneDisabledIcon />}
                >
                  Disconnect
                </Button>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <video ref={localVideoRef} autoPlay muted style={styleVideo} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <video ref={remoteVideoRef} autoPlay style={styleVideo} />
                </Grid>
                <Grid item xs={12} md={6}>
                  {<video ref={localVideoScreenRef} autoPlay muted style={styleVideo} />}
                </Grid>
                <Grid item xs={12} md={6}>
                  {<video ref={remoteVideoScreenRef} autoPlay style={styleVideo} />}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '72vh', display: 'flex', width: '100%' }}>
              <ChatWindow
                activeConversationId={connectionToRef.current}
                handleSendMessage={handleSendMessage}
                conversation={conversationRef.current}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
