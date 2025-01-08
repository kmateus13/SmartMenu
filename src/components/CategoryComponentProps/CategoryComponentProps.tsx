

interface CategoryComponentProps {
    name: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}

export default function CategoryComponent(props: CategoryComponentProps) {


    return (
        <div  onClick={props.onClick}  className={`min-w-24 flex flex-col items-center justify-center h-full cursor-pointer px-2 ${
            props.isSelected ? "opacity-100" : "opacity-50"
        }`}>
            <div className="bg-white w-16 h-16 flex justify-center items-center rounded-full border shadow-lg text-3xl">
                {props.icon}
            </div>
            <label className="w-full pt-2 text-center">{props.name}</label>
        </div>
    );
}
