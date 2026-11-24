import { renderToReadableStream } from 'react-dom/server.edge';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';

export async function prerender({ url }) {
  let renderError = null;

  const stream = await renderToReadableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
    {
      onError(error) {
        renderError = error;
      },
    }
  );

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let html = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
  }
  html += decoder.decode();

  if (renderError) throw renderError;

  return { html };
}