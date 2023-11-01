import ImageIcon from "./assets/icons/image-icon.svg";
import { useEffect, useState } from "react";
import {
	DndContext,
	closestCenter,
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
	DragOverlay,
} from "@dnd-kit/core";
import {
	SortableContext,
	rectSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";

import SortableImage from "./components/SortableImage";

function App() {
	const [images, setImages] = useState([]);
	const [activeImage, setActiveImage] = useState(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(TouchSensor)
	);

	useEffect(() => {
		fetch("./data.json")
			.then((response) => response.json())
			.then((data) => {
				setImages(data);
			});
	}, []);

	const onDragStart = (e) => {
		let index;
		const image = images.find((image, index) => {
			index = index;
			return image.id === e.active.id;
		});

		setActiveImage({ index, ...image });
	};

	const onDragEnd = (e) => {
		const { active, over } = e;

		if (active.id === over.id) {
			return;
		}

		setImages((images) => {
			const oldIndex = images.findIndex(
				(image) => image.id === active.id
			);
			const newIndex = images.findIndex((image) => image.id === over.id);
			return arrayMove(images, oldIndex, newIndex);
		});

		setActiveImage(null);
	};

	const onDragCancel = (e) => {
		setActiveImage(null);
	};

	return (
		<div className="body">
			<div className="container">
				<div className="header">
					<h1 className="header__text">Gallery</h1>
				</div>

				<div className="gallery">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
						onDragCancel={onDragCancel}
					>
						<SortableContext
							items={images}
							strategy={rectSortingStrategy}
						>
							{images &&
								images.map((image, index) => (
									<SortableImage
										key={image.id}
										image={image}
										index={index}
										overlay={false}
									/>
								))}
						</SortableContext>

						<DragOverlay adjustScale={true}>
							<SortableImage
								image={activeImage}
								index={activeImage?.index}
								overlay={true}
							></SortableImage>
						</DragOverlay>
					</DndContext>

					<div className="gallery__item gallery__item--addImage">
						<img src={ImageIcon} alt="" />
						<p>Add Image</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
