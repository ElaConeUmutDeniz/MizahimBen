
import { getJokeSource } from './jokeService';

export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

export async function scheduleJokeNotification(jokeSourceUrl: string, time: string, t: (key: string) => string) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        console.log('Notification permission not granted.');
        return;
    }
    
    console.log(`Scheduling notification for ${time} from source ${jokeSourceUrl}.`);
    
    // NOTE: True background scheduling requires a Service Worker, which is beyond the scope
    // of this single-file setup. This is a simulation that would fire if the app is open.
    // For a real app, you'd register a service worker here.
    
    try {
        const source = await getJokeSource(jokeSourceUrl);
        if (source.simdiki.length > 0) {
            // In a real implementation, you'd use the service worker to fetch this.
            // For now, we'll just log it.
            console.log(`Next notification would be about the joke at: ${source.simdiki[0]}`);
            
            // This is just a demonstration notification.
            new Notification(t('siteTitle'), {
                body: t('currentJokes') + ' hazır!',
                icon: 'https://raw.githubusercontent.com/ElaConeUmutDeniz/MizahimBen/ae18144c60789a98210a44ba12853d7d412e53a5/logo.png'
            });

        }
    } catch (error) {
        console.error('Could not fetch joke for notification:', error);
    }
}