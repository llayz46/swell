import { FC } from "react";

export const BacklogIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "#bec2c8",
}) => {
   return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="1.4 1.74"
            strokeDashoffset="0.65"
         ></circle>
         <circle
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray="0 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

export const PausedIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "#0ea5e9",
}) => {
   return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="3.14 0"
            strokeDashoffset="-0.7"
         ></circle>
         <circle
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray="6.2517693806436885 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

export const ToDoIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "#e2e2e2",
}) => {
   return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="3.14 0"
            strokeDashoffset="-0.7"
         ></circle>
         <circle
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray="0 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

export const InProgressIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "#facc15",
}) => {
   return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="3.14 0"
            strokeDashoffset="-0.7"
         ></circle>
         <circle
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray="2.0839231268812295 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

export const TechnicalReviewIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "#22c55e",
}) => {
   return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="3.14 0"
            strokeDashoffset="-0.7"
         ></circle>
         <circle
            className="progress"
            cx="7"
            cy="7"
            r="2"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray="4.167846253762459 100"
            strokeDashoffset="0"
            transform="rotate(-90 7 7)"
         ></circle>
      </svg>
   );
};

export const CompletedIcon: FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "#8b5cf6",
}) => {
   return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
         <circle
            cx="7"
            cy="7"
            r="6"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="3.14 0"
            strokeDashoffset="-0.7"
         ></circle>
         <path
            d="M4.5 7L6.5 9L9.5 5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
};