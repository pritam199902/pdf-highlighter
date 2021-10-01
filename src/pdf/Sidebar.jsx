import React from "react";
// import type { IHighlight } from "./react-pdf-highlighter";

// interface Props {
//     highlights: Array<IHighlight>;
//     resetHighlights: () => void;
//     toggleDocument: () => void;
// }

const updateHash = (highlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

export default function Sidebar({
    highlights,
    toggleDocument,
    resetHighlights, }
) {
    return (
        <div className="sidebar" style={{ width: "25vw" }}>
            

            <ul className="sidebar__highlights">
                {highlights.map((highlight, index) => (
                    <li
                        key={index}
                        className="sidebar__highlight"
                        onClick={() => {
                            updateHash(highlight);
                        }}
                    >
                        <div>
                            <strong>{highlight.comment.text}</strong>
                            {highlight.content.text ? (
                                <blockquote style={{ marginTop: "0.5rem" }}>
                                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                                </blockquote>
                            ) : null}
                            {highlight.content.image ? (
                                <div
                                    className="highlight__image"
                                    style={{ marginTop: "0.5rem" }}
                                >
                                    <img src={highlight.content.image} alt={"Screenshot"} />
                                </div>
                            ) : null}
                        </div>
                        <div className="highlight__location">
                            Page {highlight.position.pageNumber}
                        </div>
                    </li>
                ))}
            </ul>
            
        </div>
    );
}
