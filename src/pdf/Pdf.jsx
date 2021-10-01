import React, { Component, useEffect, useState } from "react";

import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
} from "react-pdf-highlighter";

// import type { IHighlight, NewHighlight } from "react-pdf-highlighter";

// import { testHighlights as _testHighlights } from "./test-highlights";
// import { Spinner } from "./Spinner";
import Sidebar from "./Sidebar";

// import "./style/App.css";

// const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

// interface State {
//   url: string;
//   highlights: Array<IHighlight>;
// }

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>{
    console.log("url parsing : ", document.location.hash.slice("#highlight-".length));
  return  document.location.hash.slice("#highlight-".length);
}

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
    comment,
}) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = PRIMARY_PDF_URL;

const App = () => {


    const [state, setState] = useState({
        url: initialUrl,
        highlights: [{
            content: {
                text: " Type Checking for JavaScript",
                // text : 'AVIK '
            },
            position: {
                boundingRect: {
                    x1: 255.73419189453125,
                    y1: 139.140625,
                    x2: 574.372314453125,
                    y2: 165.140625,
                    width: 809.9999999999999,
                    height: 1200,
                },
                rects: [
                    {
                        x1: 255.73419189453125,
                        y1: 139.140625,
                        x2: 574.372314453125,
                        y2: 165.140625,
                        width: 809.9999999999999,
                        height: 1200,
                    },
                ],
                pageNumber: 1,
            },
            comment: {
                text: "Flow or TypeScript?",
                emoji: "🔥",
            },
            id: "8245652131754351",
        }, {
            content: {
                text: " millions of lines of code atFacebookevery day",
            },
            position: {
                boundingRect: {
                    x1: 353.080810546875,
                    y1: 346.390625,
                    x2: 658.6533203125,
                    y2: 363.390625,
                    width: 809.9999999999999,
                    height: 1200,
                },
                rects: [
                    {
                        x1: 353.080810546875,
                        y1: 346.390625,
                        x2: 658.6533203125,
                        y2: 363.390625,
                        width: 809.9999999999999,
                        height: 1200,
                    },
                ],
                pageNumber: 1,
            },
            comment: {
                text: "impressive",
                emoji: "",
            },
            id: "812807243318874",
        },]
    })


    // const [check, setCheck] = useState(true)

    


    var scrollViewerTo = (highlight) => {
        // window.scrollTo(highlight.position.boundingRect.width, highlight.position.boundingRect.height)
        console.log("hh: ", highlight);
        // setCheck(false)
    };

    const scrollToHighlightFromHash = () => {
        
        const highlight = getHighlightById(parseIdFromHash());
        console.log("highlight ....", highlight);
        if (highlight) {
            // setCheck(true)
            scrollViewerTo(highlight);
        }
    };

    useEffect(() => {
        console.log("load url..", searchParams );
        // if (check) {
            window.addEventListener(
                "hashchange",
                scrollToHighlightFromHash,
                false
            );
        // }

    }, [])


    const getHighlightById = (id) => {
        const { highlights } = state;

        console.log(id);

        return highlights.find((highlight) => highlight.id === id);
    }

    const addHighlight = (highlight) => {
        const { highlights } = state;
        console.log("Saving highlight", highlight);
        setState({
            highlights: [{ ...highlight, id: getNextId() }, ...highlights],
        });
    }

    const updateHighlight = (highlightId, position, content) => {
        console.log("Updating highlight", highlightId, position, content);

        setState({
            highlights: state.highlights.map((h) => {
                const {
                    id,
                    position: originalPosition,
                    content: originalContent,
                    ...rest
                } = h;
                return id === highlightId
                    ? {
                        id,
                        position: { ...originalPosition, ...position },
                        content: { ...originalContent, ...content },
                        ...rest,
                    }
                    : h;
            }),
            ...state
        });
    }
    return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
            <Sidebar
                highlights={state.highlights}
            //   resetHighlights={this.resetHighlights}
            //   toggleDocument={this.toggleDocument}
            />
            <div
                style={{
                    height: "100vh",
                    width: "75vw",
                    position: "relative",
                }}
            >
                <PdfLoader url={state.url} beforeLoad={<div>Loading.....</div>} >
                    {(pdfDocument) => (
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            enableAreaSelection={(event) => event.altKey}
                            onScrollChange={resetHash}
                            // pdfScaleValue="page-width"
                            scrollRef={(scrollTo) => {
                                console.log("scroll ref ", scrollTo);
                                scrollViewerTo = scrollTo;
                                scrollToHighlightFromHash();
                            }}
                            onSelectionFinished={(
                                position,
                                content,
                                hideTipAndSelection,
                                transformSelection
                            ) => (
                                <Tip
                                    onOpen={transformSelection}
                                    onConfirm={(comment) => {
                                        addHighlight({ content, position, comment });

                                        hideTipAndSelection();
                                    }}
                                />
                            )}
                            highlightTransform={(
                                highlight,
                                index,
                                setTip,
                                hideTip,
                                viewportToScaled,
                                screenshot,
                                isScrolledTo
                            ) => {
                                const isTextHighlight = !Boolean(
                                    highlight.content && highlight.content.image
                                );

                                const component = isTextHighlight ? (
                                    <Highlight
                                        isScrolledTo={isScrolledTo}
                                        position={highlight.position}
                                        comment={highlight.comment}
                                    />
                                ) : (
                                    <AreaHighlight
                                        isScrolledTo={isScrolledTo}
                                        highlight={highlight}
                                        onChange={(boundingRect) => {
                                            updateHighlight(
                                                highlight.id,
                                                { boundingRect: viewportToScaled(boundingRect) },
                                                { image: screenshot(boundingRect) }
                                            );
                                        }}
                                    />
                                );

                                return (
                                    <Popup
                                        popupContent={<HighlightPopup {...highlight} />}
                                        onMouseOver={(popupContent) =>
                                            setTip(highlight, (highlight) => popupContent)
                                        }
                                        onMouseOut={hideTip}
                                        key={index}

                                        children={component}
                                    />
                                );
                            }}
                            highlights={state.highlights}
                        />
                    )}
                </PdfLoader>
            </div>
        </div>
    )

}

export default App;
