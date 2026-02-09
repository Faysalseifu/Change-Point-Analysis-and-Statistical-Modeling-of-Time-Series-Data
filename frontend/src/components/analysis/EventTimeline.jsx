import React from "react";

const EventTimeline = ({ events, onSelect }) => (
	<div className="card">
		<h3>Key event highlights</h3>
		<ul className="event-list">
			{events.map((event, index) => (
				<li
					key={`${event.date}-${index}`}
					className="event-item"
					onClick={() => onSelect?.(event)}
				>
					<strong>{event.date}</strong>
					<div>{event.title}</div>
					<div className="tag">{event.category}</div>
				</li>
			))}
		</ul>
	</div>
);

export default EventTimeline;
