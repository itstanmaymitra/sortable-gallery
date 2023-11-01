// imports
import ImageIcon from "./assets/image-icon.svg";
import Checkbox from "./assets/checkbox.svg";
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
	const [selectedImagesCount, setSelectedImagesCount] = useState(0);
	const [activeImage, setActiveImage] = useState(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5, // overlay activate after going distance 5
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200, // touch and hold drag for mobile device
				tolerance: 5,
			},
		})
	);

	// fetching initial data from data.json
	useEffect(() => {
		fetch("./data.json")
			.then((response) => response.json())
			.then((data) => {
				setImages(data);
			});
	}, []);

	// selected image count update
	useEffect(() => {
		let count = 0;
		images.forEach((d) => {
			if (d.selected) {
				count++;
			}
		});
		setSelectedImagesCount(count);
	}, [images]);

	// drag start handler
	const onDragStart = (e) => {
		let index;
		const image = images.find((image, index) => {
			index = index;
			return image.id === e.active.id;
		});

		setActiveImage({ index, ...image });
	};

	// drag end handler
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

	// drag cancel handler
	const onDragCancel = (e) => {
		setActiveImage(null);
	};

	// checkox check-uncheck handler
	const handleCheck = (event, image) => {
		const updatedImages = images.map((img) => {
			if (img.id === image.id) {
				img.selected = event.target.checked;
			}
			return img;
		});

		setImages(updatedImages);
	};

	// delete multiple images handler
	const deleteHandler = () => {
		setImages((images) => {
			const updatedImages = images.filter((img) => img.selected == false);
			return updatedImages;
		});
	};

	return (
		<div className="body">
			<div className="container">
				{/* header  */}
				<div className="header">
					{selectedImagesCount < 1 ? (
						<h1 className="header__text">Gallery</h1>
					) : (
						<>
							<p>
								<img src={Checkbox} alt="" />

								<span>
									{`${selectedImagesCount} File${
										selectedImagesCount > 1 ? "s" : ""
									} Selected.`}
								</span>
							</p>

							<button
								onClick={deleteHandler}
								className="header__btn"
							>
								Delete Files
							</button>
						</>
					)}
				</div>

				{/* gallery grid section  */}
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
									// gallery grid item
									<SortableImage
										key={image.id}
										image={image}
										index={index}
										overlay={false}
										handleCheck={handleCheck}
										selected={image.selected}
									/>
								))}
						</SortableContext>

						<DragOverlay adjustScale={true}>
							{/* overlay while draging image */}
							<SortableImage
								image={activeImage}
								index={activeImage?.index}
								overlay={true}
							></SortableImage>
						</DragOverlay>
					</DndContext>

					{/* add image box */}
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
