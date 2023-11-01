import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableImage = ({ image, index, overlay, handleCheck, selected }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: image.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			className={`gallery__item ${
				index == 0 ? "gallery__item--feature" : ""
			} ${selected ? "gallery__item--fade" : ""}`}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
		>
			<img src={image.image} alt="" className="gallery__item--img" />

			{!overlay && (
				<div className="gallery__item--overlay">
					<input
						type="checkbox"
						name={image.id}
						onChange={(e) => handleCheck(e, image)}
						checked={selected}
					/>
				</div>
			)}
		</div>
	);
};

export default SortableImage;
