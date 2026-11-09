import { IconButton } from "@mui/material";
import  { useContext } from "react";
import { TableContext } from "./GlPanelTable";

export default function GlFilterBtn() {
      const { openFilter, setOpenFilter } = useContext(TableContext);

  return (
    <IconButton
      onClick={() => setOpenFilter(!openFilter)}
      aria-placeholder="filter"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_1_1167"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="17"
          height="17"
        >
          <rect
            x="0.000488281"
            y="0.675598"
            width="16.4335"
            height="16.2"
            fill={openFilter ? "#08A90A" : "#111"}
          />
        </mask>
        <g mask="url(#mask0_1_1167)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.7729 16.8759H5.6913C5.47256 16.8759 5.29523 16.6985 5.29523 16.4798V8.37553L0.427761 2.60037C0.235823 2.36157 0.102943 2.11346 0.0419589 1.88429C-0.0154942 1.6686 -0.0145313 1.45805 0.0528718 1.27124C0.126694 1.06454 0.274981 0.89796 0.499337 0.793004C0.653722 0.721107 0.844698 0.680024 1.07258 0.679061L15.1727 0.677135C15.4272 0.667827 15.6525 0.707948 15.8384 0.787547C16.0637 0.882875 16.2325 1.04015 16.3339 1.24236C16.4318 1.43815 16.4601 1.66828 16.409 1.91831C16.3609 2.15069 16.2431 2.4033 16.0457 2.66167L11.1689 8.3781V16.4798C11.1689 16.6985 10.9916 16.8759 10.7729 16.8759Z"
            fill={openFilter ? "#08A90A" : "#111"}
          />
        </g>
      </svg>
    </IconButton>
  );
}
