<script lang="ts">
	import { enhance } from '$app/forms';
	import EventLog from '$lib/EventLog.svelte';
	import logo from '$lib/openai-logomark.svg';
	import ToolPanel from '$lib/ToolPanel.svelte';
	import SessionControls from '$lib/SessionControls.svelte';

	let form: HTMLFormElement | null = null;
	let events: any[] = $state([]);
	let peerConnection: RTCPeerConnection | null = null;
	let audioElement: HTMLAudioElement;
	let isSessionActive = $state(false);
	let dataChannel: RTCDataChannel | null = $state(null);

	const startSession = () => {
		// Initialize WebRTC connection
		form?.requestSubmit();
	};

	const stopSession = () => {
		// Kill all Channels.
		dataChannel?.close();
		dataChannel = null;

		// Kill all Connections.
		peerConnection?.getSenders().forEach((sender) => {
			if (sender.track) {
				sender.track.stop();
			}
		});
		peerConnection?.close();
		peerConnection = null;

		// Reset state
		isSessionActive = false;
		dataChannel = null;
	};

	const sendClientEvent = (message: any) => {
		if (dataChannel) {
			const timestamp = new Date().toLocaleTimeString();
			message.event_id = message.event_id || crypto.randomUUID();

			dataChannel.send(JSON.stringify(message));

			if (!message.timestamp) {
				message.timestamp = timestamp;
			}

			events = [...events, message];
		} else {
			console.error('Failed to send message - no data channel available', message);
		}
	};

	function sendTextMessage(message: any) {
		const event = {
			type: 'conversation.item.create',
			item: {
				type: 'message',
				role: 'user',
				content: [
					{
						type: 'input_text',
						text: message
					}
				]
			}
		};

		sendClientEvent(event);
		sendClientEvent({ type: 'response.create' });
	}

	const onSubmit = () => {
		return async ({ result }: any) => {
			if (result.type === 'success') {
				// Handle success
				const EPHEMERAL_KEY = result.data.data.client_secret.value;

				// Create a peer connection
				const pc = new RTCPeerConnection();

				// Set up to play remote audio from the model
				pc.ontrack = (e) => (audioElement.srcObject = e.streams[0]);

				// Add local audio track for microphone input in the browser
				const ms = await navigator.mediaDevices.getUserMedia({
					audio: true
				});
				pc.addTrack(ms.getTracks()[0]);

				// Set up data channel for sending and receiving events
				const dc = pc.createDataChannel('oai-events');
				dataChannel = dc;

				// Start the session using the Session Description Protocol (SDP)
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);

				const baseUrl = 'https://api.openai.com/v1/realtime';
				const model = 'gpt-4o-realtime-preview-2024-12-17';
				const sdpResponse = await fetch(`${baseUrl}?model=${model}?voice=verse`, {
					method: 'POST',
					body: offer.sdp,
					headers: {
						Authorization: `Bearer ${EPHEMERAL_KEY}`,
						'Content-Type': 'application/sdp'
					}
				});

				const answer: RTCSessionDescriptionInit = {
					type: 'answer',
					sdp: await sdpResponse.text()
				};

				await pc.setRemoteDescription(answer);
				peerConnection = pc;

				isSessionActive = true;
			} else {
				// Handle error
				console.error('Error starting session:', result.error);
			}
		};
	};

	$effect(() => {
		if (dataChannel) {
			// Append new server events to the list
			dataChannel.addEventListener('message', (e) => {
				const event = JSON.parse(e.data);
				if (!event.timestamp) {
					event.timestamp = new Date().toLocaleTimeString();
				}

				events = [event, ...events];
			});

			// Set session active when the data channel is opened
			dataChannel.addEventListener('open', () => {
				isSessionActive = true;
				events = [];
			});
		}
	});
</script>

<nav>
	<header>
		<img src={logo} alt={logo} />
		<h1>realtime console</h1>
	</header>
</nav>
<div class="main">
	<section class="events-section">
		<section class="events-section-inner">
			<EventLog bind:events />
		</section>
		<section class="session-controls">
			<SessionControls {startSession} {stopSession} {sendTextMessage} {isSessionActive} />
		</section>
	</section>
	<section class="tool-panel">
		<ToolPanel {sendClientEvent} {events} {isSessionActive} />
	</section>
</div>

<!-- AUDIO ELEMENT BOUND TO audioElement -->
<audio bind:this={audioElement} autoplay></audio>

<!-- FORM BOUND TO form -->
<form method="POST" action="?/startSession" bind:this={form} use:enhance={onSubmit}>
	<input type="hidden" name="eventType" value="session.start" />
</form>

<style>
	nav {
		display: flex;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		align-items: center;
		height: 4rem;
	}
	header {
		display: flex;
		padding-bottom: 0.5rem;
		margin: 1rem;
		gap: 1rem;
		align-items: center;
		border-width: 0;
		border-bottom-width: 1px;
		border-color: #e5e7eb;
		border-style: solid;
		width: 100%;
	}
	img {
		width: 24px;
	}
	.main {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		top: 4rem;
	}
	.events-section {
		display: flex;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 380px;
	}
	.events-section-inner {
		overflow-y: auto;
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 8rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	.session-controls {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		padding: 1rem;
		height: 8rem;
	}
	.tool-panel {
		overflow-y: auto;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		padding: 1rem;
		padding-top: 0;
		width: 380px;
	}
</style>
