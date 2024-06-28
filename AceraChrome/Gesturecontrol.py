# Gesturecontrol.py

import cv2
import mediapipe as mp
import math
import pyautogui

def activate_gesture_control_func():
    try:
        # Your gesture control initialization and loop
        cap = cv2.VideoCapture(0)
        gc = GestureControl()

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame, gesture, hand_landmarks = gc.detect_gestures(frame)
            cv2.imshow('Gesture Control', frame)

            if cv2.waitKey(5) & 0xFF == 27:
                break

        gc.close()
        cap.release()
        cv2.destroyAllWindows()

        return True  # Return True if activation was successful
    except Exception as e:
        print(f"Error in activate_gesture_control_func: {str(e)}")
        return False  # Return False if activation failed

class GestureControl:
    def __init__(self, min_detection_confidence=0.7, min_tracking_confidence=0.7, smooth_factor=0.5, click_threshold=0.1, scroll_threshold=0.3):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(min_detection_confidence=min_detection_confidence, min_tracking_confidence=min_tracking_confidence)
        self.mp_drawing = mp.solutions.drawing_utils
        self.smooth_factor = smooth_factor
        self.click_threshold = click_threshold
        self.scroll_threshold = scroll_threshold
        self.prev_gesture = None
        self.gesture_count = 0
        self.prev_x, self.prev_y = None, None
        self.screen_width, self.screen_height = pyautogui.size()
        self.dragging = False

    def detect_gestures(self, frame):
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(image)
        gesture = None
        hand_landmarks = None

        if results.multi_hand_landmarks:
            for landmarks in results.multi_hand_landmarks:
                self.mp_drawing.draw_landmarks(frame, landmarks, self.mp_hands.HAND_CONNECTIONS, 
                                               self.mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2, circle_radius=2),
                                               self.mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2))
                gesture = self.interpret_gestures(landmarks)
                hand_landmarks = landmarks

                if gesture:
                    self.gesture_count += 1
                    if self.gesture_count >= 3:
                        self.prev_gesture = gesture
                        self.gesture_count = 0
                else:
                    self.gesture_count = 0

                if self.prev_gesture:
                    cv2.putText(frame, self.prev_gesture, (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

                # Draw the green dot
                index_finger_tip = landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
                x, y = int(index_finger_tip.x * frame.shape[1]), int(index_finger_tip.y * frame.shape[0])
                cv2.circle(frame, (x, y), 10, (0, 255, 0), -1 if self.prev_gesture in ["click", "right_click", "double_click", "drag"] else 2)

        if hand_landmarks:
            cursor_x, cursor_y = self.smooth_cursor_movement(hand_landmarks, self.screen_width, self.screen_height)
            pyautogui.moveTo(cursor_x, cursor_y)

            if self.prev_gesture == "click":
                pyautogui.click()
            elif self.prev_gesture == "right_click":
                pyautogui.rightClick()
            elif self.prev_gesture == "double_click":
                pyautogui.doubleClick()
            elif self.prev_gesture == "drag":
                if not self.dragging:
                    pyautogui.mouseDown()
                    self.dragging = True
                pyautogui.moveTo(cursor_x, cursor_y)
            else:
                if self.dragging:
                    pyautogui.mouseUp()
                    self.dragging = False

        smoothed_gesture = self.smooth_gesture(gesture)
        return frame, smoothed_gesture, hand_landmarks

    def interpret_gestures(self, hand_landmarks):
        thumb_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.THUMB_TIP]
        index_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
        middle_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
        ring_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.RING_FINGER_TIP]
        pinky_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.PINKY_TIP]

        # Click gesture: Index finger near thumb base
        if self.is_near(thumb_tip, index_tip):
            return "click"

        # Right click gesture: Pinky finger to thumb
        if self.is_near(thumb_tip, pinky_tip):
            return "right_click"

        # Double click gesture: Ring finger to thumb
        if self.is_near(thumb_tip, ring_tip):
            return "double_click"

        # Drag gesture: Middle finger to thumb
        if self.is_near(thumb_tip, middle_tip):
            return "drag"

        return "move"

    def is_near(self, finger1, finger2, threshold=0.05):
        distance = math.dist((finger1.x, finger1.y), (finger2.x, finger2.y))
        return distance < threshold

    def smooth_cursor_movement(self, hand_landmarks, screen_width, screen_height):
        index_finger_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
        x, y = int(index_finger_tip.x * screen_width), int(index_finger_tip.y * screen_height)

        x = screen_width - x

        if self.prev_x is None or self.prev_y is None:
            self.prev_x, self.prev_y = x, y
        else:
            x = int((x + self.prev_x * self.smooth_factor) / (self.smooth_factor + 1))
            y = int((y + self.prev_y * self.smooth_factor) / (self.smooth_factor + 1))
            self.prev_x, self.prev_y = x, y

        return x, y

    def smooth_gesture(self, gesture):
        if gesture == self.prev_gesture:
            return gesture
        elif self.prev_gesture is None:
            self.prev_gesture = gesture
            return gesture
        else:
            self.prev_gesture = gesture
            return None

    def close(self):
        self.hands.close()

