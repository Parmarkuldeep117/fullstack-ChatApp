import { Search } from "lucide-react";
import { useRef } from 'react';

const SearchInput = ({ value, onChange }) => {
    const inputRef = useRef(null);

    return (
        <div
            onClick={() => inputRef.current.focus()}
            className="w-full
        flex items-center gap-2
        bg-base-100
        px-4 py-2
        rounded-xl
        cursor-text
        transition-all
        focus-within:ring-2
        focus-within:ring-secondary
      "
        >
            <Search size={16} className="opacity-60" />

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search Users"
                className="
          bg-transparent
          outline-none
          flex-1
          text-sm
          placeholder:opacity-60
        "
            />

        </div>
    );
};

export default SearchInput
