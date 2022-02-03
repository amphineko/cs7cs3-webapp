import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { default as NextDocument, DocumentContext, Head, Html, Main, NextScript } from 'next/document'

export default class Document extends NextDocument<{ emotionStyleTags: JSX.Element }> {
    render() {
        return (
            <Html>
                <Head>{this.props.emotionStyleTags}</Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }

    getInitialProps = async (ctx: DocumentContext) => {
        const renderPage = ctx.renderPage

        const cache = createCache({ key: 'css', prepend: true })
        const server = createEmotionServer(cache)

        const enhanceApp = (App) =>
            function EnhancedApp(props) {
                return <App emotionCache={cache} {...props} />
            }

        ctx.renderPage = (options) => renderPage({ ...options, enhanceApp })

        const initialProps = await NextDocument.getInitialProps(ctx)

        const emotionStyles = server.extractCriticalToChunks(initialProps.html)
        const emotionStyleTags = emotionStyles.styles.map((sheet) => (
            <style
                data-emotion={[sheet.key, ...sheet.ids].join(' ')}
                dangerouslySetInnerHTML={{ __html: sheet.css }}
                key={sheet.key}
            />
        ))

        return {
            ...initialProps,
            emotionStyleTags,
        }
    }
}
